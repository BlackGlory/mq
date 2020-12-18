--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- mq资源本身是松散的, 没有自己的表

CREATE TABLE mq_throttle (
  mq_id            VARCHAR(255) NOT NULL UNIQUE
, cycle_start_time DATETIME     NOT NULL
, count            INTEGER      NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX mq_throttle_mq_id
    ON mq_throttle(mq_id);

CREATE TABLE mq_stats (
  mq_id     VARCHAR(255) NOT NULL UNIQUE
, drafting  INTEGER      NOT NULL DEFAULT 0
, waiting   INTEGER      NOT NULL DEFAULT 0
, ordered   INTEGER      NOT NULL DEFAULT 0
, active    INTEGER      NOT NULL DEFAULT 0
, completed INTEGER      NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX idx_mq_stats_mq_id
    ON mq_stats(mq_id);

CREATE INDEX idx_mq_stats_ordered
    ON mq_stats(ordered);

CREATE INDEX idx_mq_stats_active
    ON mq_stats(active);

CREATE TABLE mq_message_state (
  state VARCHAR(255) PRIMARY KEY NOT NULL
);
INSERT INTO mq_message_state (state)
VALUES ('drafting')
     , ('waiting')
     , ('ordered')
     , ('active');

CREATE TABLE mq_message (
  mq_id            VARCHAR(255) NOT NULL
, message_id       VARCHAR(255) NOT NULL
, priority         INTEGER
, type             VARCHAR(255)
, payload          TEXT
, hash             VARCHAR(255)
, state            VARCHAR(255) NOT NULL
, state_updated_at DATETIME     NOT NULL
, PRIMARY KEY (mq_id, message_id)
, FOREIGN KEY (state) REFERENCES mq_message_state(state)
, CHECK ((priority IS NULL) OR (priority >= 0))
, CHECK (
    CASE
      WHEN payload IS NULL THEN hash IS NULL
      ELSE hash IS NOT NULL
    END
  )
, CHECK (
    CASE
      WHEN hash IS NULL THEN payload IS NULL
      ELSE payload IS NOT NULL
    END
  )
);

CREATE INDEX idx_mq_message_state
    ON mq_message(state);

CREATE INDEX idx_mq_message_hash
    ON mq_message(hash);

CREATE INDEX idx_mq_message_state_updated_at
    ON mq_message(state_updated_at);

CREATE INDEX idx_mq_message_priority
    ON mq_message(priority);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE mq_throttle;
DROP TABLE mq_stats;
DROP TABLE mq_message_state;
DROP TABLE mq_message;
