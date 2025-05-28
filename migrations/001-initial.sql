--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能.
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑.

CREATE TABLE mq_additional_behavior (
  name  VARCHAR(255) NOT NULL
, value INTEGER      NOT NULL UNIQUE
);
INSERT INTO mq_additional_behavior (name, value)
VALUES ('none', 0)
     , ('remove message', 1)
     , ('remove all slots', 2);

CREATE TABLE mq_queue (
  id                      VARCHAR(255) NOT NULL UNIQUE

, uniq                    BOOLEAN      NOT NULL
, drafting_timeout        INTEGER      NOT NULL
, ordered_timeout         INTEGER      NOT NULL
, active_timeout          INTEGER      NOT NULL
, concurrency             INTEGER
, behavior_when_completed INTEGER      NOT NULL
, behavior_when_abandoned INTEGER      NOT NULL

, drafting                INTEGER      NOT NULL DEFAULT 0
, waiting                 INTEGER      NOT NULL DEFAULT 0
, ordered                 INTEGER      NOT NULL DEFAULT 0
, active                  INTEGER      NOT NULL DEFAULT 0
, failed                  INTEGER      NOT NULL DEFAULT 0
, completed               INTEGER      NOT NULL DEFAULT 0
, abandoned               INTEGER      NOT NULL DEFAULT 0

, FOREIGN KEY (behavior_when_completed)
  REFERENCES mq_additional_behavior(value)
, FOREIGN KEY (behavior_when_abandoned)
  REFERENCES mq_additional_behavior(value)
);

CREATE TABLE mq_message_state (
  name  VARCHAR(255) NOT NULL
, value INTEGER      NOT NULL UNIQUE
);
INSERT INTO mq_message_state (name, value)
VALUES ('drafting', 0)
     , ('waiting', 1)
     , ('ordered', 2)
     , ('active', 3)
     , ('failed', 4)
     , ('completed', 5)
     , ('abandoned', 6);

CREATE TABLE mq_message (
  queue_id         VARCHAR(255) NOT NULL
, id               VARCHAR(255) NOT NULL
, priority         INTEGER
, hash             VARCHAR(255)
, state            INTEGER      NOT NULL
, state_updated_at DATETIME     NOT NULL

, UNIQUE (queue_id, id)
, FOREIGN KEY (queue_id)
  REFERENCES mq_queue(id)
  ON DELETE CASCADE
, FOREIGN KEY (state)
  REFERENCES mq_message_state(value)
);

-- 优化消息order操作的性能.
-- 由于SQLite的AND条件只能使用一个索引, 因此需要建立专门的复合索引.
CREATE INDEX idx_mq_message_queue_id_state_priority_state_updated_at
          ON mq_message(
               queue_id
             , state
             , priority DESC
             , state_updated_at	ASC
             );

-- 优化消息状态相关查询的性能.
CREATE INDEX idx_mq_message_queue_id_state_state_updated_at
          ON mq_message(
               queue_id
             , state
             , state_updated_at
             );

-- 优化消息去重的性能.
CREATE INDEX idx_mq_message_queue_id_id_hash
          ON mq_message(
               queue_id
             , id
             , hash
             );

CREATE TABLE mq_message_slot (
  queue_id   VARCHAR(255) NOT NULL
, message_id VARCHAR(255) NOT NULL
, name       VARCHAR(255) NOT NULL
, value      TEXT

, UNIQUE (queue_id, message_id, name)
, FOREIGN KEY (queue_id, message_id)
  REFERENCES mq_message(queue_id, id)
  ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE mq_message_slot;
DROP TABLE mq_message;
DROP TABLE mq_message_state;
DROP TABLE mq_queue;
DROP TABLE mq_additional_behavior;

PRAGMA journal_mode = DELETE;
