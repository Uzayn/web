-- Make odds column nullable to support picks without odds data
ALTER TABLE picks ALTER COLUMN odds DROP NOT NULL;
