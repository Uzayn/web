-- Seed data for local development

-- Test picks for today
INSERT INTO picks (sport, league, matchup, selection, odds, stake, confidence, analysis, is_vip, result, event_date) VALUES
('nba', 'NBA', 'Lakers vs Celtics', 'Lakers +4.5', 1.91, 1, 'high', 'Lakers have covered in 7 of their last 10 games. Strong ATS performance on the road.', false, 'pending', CURRENT_DATE + INTERVAL '19 hours'),
('nfl', 'NFL', 'Chiefs vs Bills', 'Over 48.5', 1.87, 1, 'medium', 'Both offenses have been firing lately. Combined for 60+ in their last meeting.', false, 'pending', CURRENT_DATE + INTERVAL '20 hours'),
('soccer', 'Premier League', 'Arsenal vs Chelsea', 'Both Teams to Score', 1.72, 1, 'high', 'Both teams have scored in their last 5 H2H meetings.', false, 'pending', CURRENT_DATE + INTERVAL '15 hours'),
('nba', 'NBA', 'Warriors vs Suns', 'Warriors -3.5', 1.95, 2, 'high', 'Warriors are 8-2 in their last 10 home games. Curry averaging 32 PPG in this matchup.', true, 'pending', CURRENT_DATE + INTERVAL '21 hours'),
('nhl', 'NHL', 'Rangers vs Bruins', 'Under 5.5', 1.85, 1, 'medium', 'Both goalies have been stellar. Last 4 meetings all under 5 goals.', true, 'pending', CURRENT_DATE + INTERVAL '19 hours');

-- Test picks for yesterday (with results)
INSERT INTO picks (sport, league, matchup, selection, odds, stake, confidence, analysis, is_vip, result, profit_loss, event_date, settled_at) VALUES
('nba', 'NBA', 'Bucks vs 76ers', 'Bucks -2.5', 1.90, 1, 'high', 'Giannis dominant at home. 76ers missing key starter.', false, 'win', 0.90, CURRENT_DATE - INTERVAL '5 hours', CURRENT_DATE - INTERVAL '1 hour'),
('nfl', 'NFL', 'Eagles vs Cowboys', 'Eagles ML', 1.65, 2, 'high', 'Eagles dominant at home with 7-1 record.', false, 'loss', -2.00, CURRENT_DATE - INTERVAL '4 hours', CURRENT_DATE - INTERVAL '1 hour'),
('soccer', 'La Liga', 'Barcelona vs Real Madrid', 'Over 2.5', 1.80, 1, 'medium', 'El Clasico always delivers goals. 8 of last 10 went over.', true, 'win', 0.80, CURRENT_DATE - INTERVAL '8 hours', CURRENT_DATE - INTERVAL '3 hours');

-- Test picks for tomorrow
INSERT INTO picks (sport, league, matchup, selection, odds, stake, confidence, analysis, is_vip, result, event_date) VALUES
('mma', 'UFC', 'McGregor vs Chandler', 'McGregor by KO/TKO', 2.10, 1, 'medium', 'McGregor historically dangerous in first two rounds.', false, 'pending', CURRENT_DATE + INTERVAL '1 day 22 hours'),
('nba', 'NBA', 'Nuggets vs Timberwolves', 'Nuggets -1.5', 1.88, 1, 'high', 'Jokic triple-double machine. Nuggets 6-1 in last 7 vs MIN.', true, 'pending', CURRENT_DATE + INTERVAL '1 day 20 hours');

-- Test picks for 2 days ago
INSERT INTO picks (sport, league, matchup, selection, odds, stake, confidence, analysis, is_vip, result, profit_loss, event_date, settled_at) VALUES
('tennis', 'ATP', 'Djokovic vs Alcaraz', 'Djokovic ML', 2.05, 1, 'low', 'Djokovic experience edge in Grand Slam finals.', false, 'win', 1.05, CURRENT_DATE - INTERVAL '2 days 6 hours', CURRENT_DATE - INTERVAL '2 days'),
('nba', 'NBA', 'Heat vs Knicks', 'Heat +6.5', 1.91, 1, 'medium', 'Heat cover as underdogs at 62% rate this season.', false, 'push', 0, CURRENT_DATE - INTERVAL '2 days 3 hours', CURRENT_DATE - INTERVAL '2 days');
