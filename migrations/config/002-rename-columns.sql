--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE mq_blacklist
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_whitelist
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_token_policy
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_token
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_json_schema
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_configuration
RENAME COLUMN mq_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE mq_blacklist
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_whitelist
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_token_policy
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_token
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_json_schema
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_configuration
RENAME COLUMN namespace TO mq_id;
