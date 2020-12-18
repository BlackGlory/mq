--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- mq资源本身是松散的, 没有自己的表

CREATE TABLE mq_blacklist (
  mq_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mq_whitelist (
  mq_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mq_token_policy (
  mq_id                  VARCHAR(255) NOT NULL UNIQUE
, produce_token_required BOOLEAN
, consume_token_required BOOLEAN
, clear_token_required   BOOLEAN
);

CREATE TABLE mq_token (
  mq_id              VARCHAR(255) NOT NULL
, token              VARCHAR(255) NOT NULL
, produce_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(produce_permission IN (0,1))
, consume_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(consume_permission IN (0,1))
, clear_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(clear_permission IN (0,1))
, UNIQUE (token, mq_id)
);

CREATE TABLE mq_json_schema (
  mq_id       VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE mq_configuration (
  mq_id             VARCHAR(255) NOT NULL UNIQUE
, uniq              BOOLEAN
, drafting_timeout  INTEGER
, ordered_timeout   INTEGER
, active_timeout    INTEGER
, concurrency       INTEGER
, throttle_duration INTEGER
, throttle_limit    INTEGER
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE mq_blacklist;
DROP TABLE mq_whitelist;
DROP TABLE mq_token_policy;
DROP TABLE mq_token;
DROP TABLE mq_json_schema;
DROP TABLE mq_configuration;
