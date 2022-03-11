--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE mq_configuration
 DROP COLUMN throttle_duration;

ALTER TABLE mq_configuration
 DROP COLUMN throttle_limit;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE mq_configuration
  ADD COLUMN throttle_duration INTEGER;

ALTER TABLE mq_configuration
  ADD COLUMN throttle_limit INTEGER;
