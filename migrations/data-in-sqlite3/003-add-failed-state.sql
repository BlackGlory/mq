--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

INSERT INTO mq_message_state (state)
VALUES ('failed');

ALTER TABLE mq_stats
  ADD COLUMN failed INTEGER NOT NULL DEFAULT 0;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DELETE FROM mq_message
 WHERE state = 'failed';

DELETE FROM mq_message_state
 WHERE state = 'failed';

BEGIN TRANSACTION;
  CREATE TABLE new_mq_stats (
    mq_id     VARCHAR(255) NOT NULL UNIQUE
  , drafting  INTEGER      NOT NULL DEFAULT 0
  , waiting   INTEGER      NOT NULL DEFAULT 0
  , ordered   INTEGER      NOT NULL DEFAULT 0
  , active    INTEGER      NOT NULL DEFAULT 0
  , completed INTEGER      NOT NULL DEFAULT 0
  );

  INSERT INTO new_mq_stats (mq_id, drafting, waiting, ordered, active, completed)
  SELECT mq_id, drafting, waiting, ordered, active, completed
    FROM mq_stats;

  DROP TABLE mq_stats;

  ALTER TABLE new_mq_stats
  RENAME TO mq_stats;

  CREATE INDEX idx_mq_stats_ordered
      ON mq_stats(ordered);

  CREATE INDEX idx_mq_stats_active
      ON mq_stats(active);
COMMIT;
