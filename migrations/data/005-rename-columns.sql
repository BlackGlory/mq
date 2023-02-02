--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE mq_throttle
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_stats
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_message
RENAME COLUMN mq_id TO namespace;

ALTER TABLE mq_message
RENAME COLUMN message_id TO id;

DROP INDEX idx_mq_message_mq_id_state_priority_state_updated_at;
CREATE INDEX idx_mq_message_namespace_state_priority_state_updated_at
          ON mq_message(
               namespace
             , state
             , priority ASC
             , state_updated_at	ASC
             );

DROP INDEX idx_mq_message_mq_id_state;
CREATE INDEX idx_mq_message_namespace_state
          ON mq_message(
               namespace
             , state
             );

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE mq_throttle
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_stats
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_message
RENAME COLUMN namespace TO mq_id;

ALTER TABLE mq_message
RENAME COLUMN id TO message_id;

DROP INDEX idx_mq_message_namespace_state_priority_state_updated_at
CREATE INDEX idx_mq_message_mq_id_state_priority_state_updated_at
          ON mq_message(
               mq_id
             , state
             , priority ASC
             , state_updated_at	ASC
             );

DROP INDEX idx_mq_message_namespace_state
CREATE INDEX idx_mq_message_mq_id_state
          ON mq_message(
               mq_id
             , state
             );
