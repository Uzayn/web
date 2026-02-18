export interface FixtureSelection {
  name: string;
  odds: number;
}

export interface Fixture {
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  eventDate: string;
  selections: FixtureSelection[];
}

interface ApiFootballFixture {
  fixture: { date: string };
  league: { name: string; country: string; id: number };
  teams: { home: { name: string }; away: { name: string } };
}

interface OddsApiEvent {
  sport_title: string;
  home_team: string;
  away_team: string;
  commence_time: string;
}

interface OddsApiOddsEvent extends OddsApiEvent {
  bookmakers: {
    title: string;
    markets: {
      key: string;
      outcomes: { name: string; price: number }[];
    }[];
  }[];
}

// --- In-memory cache (1-hour TTL) ---
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

const ODDS_API_SPORT_KEYS: Record<string, string> = {
  nfl: "americanfootball_nfl",
  nba: "basketball_nba",
  mlb: "baseball_mlb",
  nhl: "icehockey_nhl",
  mma: "mma_mixed_martial_arts",
  tennis: "tennis_atp_french_open",
  boxing: "boxing_boxing",
};

const SOCCER_ODDS_KEYS = [
  "soccer_epl",
  "soccer_spain_la_liga",
  "soccer_italy_serie_a",
  "soccer_germany_bundesliga",
  "soccer_france_ligue_one",
  "soccer_uefa_champs_league",
];

// API-Football league IDs for top leagues — these get sorted to the top
const TOP_LEAGUE_IDS = new Set([
  39,  // Premier League (England)
  140, // La Liga (Spain)
  135, // Serie A (Italy)
  78,  // Bundesliga (Germany)
  61,  // Ligue 1 (France)
  2,   // Champions League
  3,   // Europa League
  848, // Conference League
  88,  // Eredivisie (Netherlands)
  94,  // Primeira Liga (Portugal)
  203, // Super Lig (Turkey)
  144, // Belgian Pro League
  40,  // Championship (England)
  253, // MLS (USA)
  71,  // Serie A (Brazil)
]);

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(fc|cf|sc|ac|afc|ssc|rc|rcd|us|as|bsc|vfb|vfl|1\.)\b/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSelections(event: OddsApiOddsEvent): FixtureSelection[] {
  for (const bookmaker of event.bookmakers) {
    const h2h = bookmaker.markets.find((m) => m.key === "h2h");
    if (h2h && h2h.outcomes.length > 0) {
      return h2h.outcomes.map((o) => ({ name: o.name, odds: o.price }));
    }
  }
  return [];
}

async function fetchOddsForSport(sportKey: string): Promise<OddsApiOddsEvent[]> {
  const cacheKey = `odds:${sportKey}`;
  const cached = getCached<OddsApiOddsEvent[]>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${apiKey}&regions=eu&markets=h2h&dateFormat=iso`,
      { signal: controller.signal }
    ).finally(() => clearTimeout(timeout));

    if (!res.ok) return [];

    const events: OddsApiOddsEvent[] = await res.json();
    setCache(cacheKey, events);
    return events;
  } catch {
    return [];
  }
}

export async function fetchSoccerFixtures(date: string): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}`,
    {
      headers: { "x-apisports-key": apiKey },
      signal: controller.signal,
    }
  ).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    throw new Error(`API-Football responded with ${res.status}`);
  }

  const data = await res.json();
  const fixtures: ApiFootballFixture[] = data.response || [];

  // Sort: top leagues first, then alphabetically by country + league
  fixtures.sort((a, b) => {
    const aTop = TOP_LEAGUE_IDS.has(a.league.id) ? 0 : 1;
    const bTop = TOP_LEAGUE_IDS.has(b.league.id) ? 0 : 1;
    if (aTop !== bTop) return aTop - bTop;
    const aKey = `${a.league.country} ${a.league.name}`;
    const bKey = `${b.league.country} ${b.league.name}`;
    return aKey.localeCompare(bKey);
  });

  // Fetch soccer odds from The Odds API for top leagues (in parallel, cached)
  const oddsResults = await Promise.allSettled(
    SOCCER_ODDS_KEYS.map((key) => fetchOddsForSport(key))
  );

  // Flatten all odds events into a lookup by normalized team names
  const selectionsLookup = new Map<string, FixtureSelection[]>();
  for (const result of oddsResults) {
    if (result.status !== "fulfilled") continue;
    for (const event of result.value) {
      const selections = extractSelections(event);
      if (selections.length === 0) continue;
      const key = `${normalizeName(event.home_team)}::${normalizeName(event.away_team)}`;
      selectionsLookup.set(key, selections);
    }
  }

  return fixtures.map((f) => {
    const key = `${normalizeName(f.teams.home.name)}::${normalizeName(f.teams.away.name)}`;
    return {
      league: f.league.name,
      country: f.league.country,
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      eventDate: f.fixture.date,
      selections: selectionsLookup.get(key) ?? [],
    };
  });
}

export async function fetchOddsApiFixtures(
  sport: string
): Promise<Fixture[]> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error("ODDS_API_KEY not configured");
  }

  const sportKey = ODDS_API_SPORT_KEYS[sport];
  if (!sportKey) {
    throw new Error(`Unsupported sport: ${sport}`);
  }

  const events = await fetchOddsForSport(sportKey);

  return events.map((e) => ({
    league: e.sport_title,
    country: "",
    homeTeam: e.home_team,
    awayTeam: e.away_team,
    eventDate: e.commence_time,
    selections: extractSelections(e),
  }));
}

export async function fetchFixtures(
  sport: string,
  date: string
): Promise<Fixture[]> {
  if (sport === "soccer") {
    return fetchSoccerFixtures(date);
  }
  return fetchOddsApiFixtures(sport);
}
