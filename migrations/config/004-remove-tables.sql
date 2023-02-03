--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

DROP TABLE mq_blacklist;
DROP TABLE mq_whitelist;
DROP TABLE mq_token_policy;
DROP TABLE mq_token;
DROP TABLE mq_json_schema;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

CREATE TABLE mq_blacklist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mq_whitelist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mq_token_policy (
  namespace              VARCHAR(255) NOT NULL UNIQUE
, produce_token_required BOOLEAN
, consume_token_required BOOLEAN
, clear_token_required   BOOLEAN
);

CREATE TABLE mq_token (
  namespace          VARCHAR(255) NOT NULL
, token              VARCHAR(255) NOT NULL
, produce_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(produce_permission IN (0,1))
, consume_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(consume_permission IN (0,1))
, clear_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(clear_permission IN (0,1))
, UNIQUE (token, namespace)
);

CREATE TABLE mq_json_schema (
  namespace   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);
