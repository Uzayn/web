export interface Fixture {
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  eventDate: string;
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

const ODDS_API_SPORT_KEYS: Record<string, string> = {
  nfl: "americanfootball_nfl",
  nba: "basketball_nba",
  mlb: "baseball_mlb",
  nhl: "icehockey_nhl",
  mma: "mma_mixed_martial_arts",
  tennis: "tennis_atp_french_open",
  boxing: "boxing_boxing",
};

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

  return fixtures.map((f) => ({
    league: f.league.name,
    country: f.league.country,
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    eventDate: f.fixture.date,
  }));
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(
    `https://api.the-odds-api.com/v4/sports/${sportKey}/events?apiKey=${apiKey}&dateFormat=iso`,
    { signal: controller.signal }
  ).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    throw new Error(`Odds API responded with ${res.status}`);
  }

  const events: OddsApiEvent[] = await res.json();

  return events.map((e) => ({
    league: e.sport_title,
    country: "",
    homeTeam: e.home_team,
    awayTeam: e.away_team,
    eventDate: e.commence_time,
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
