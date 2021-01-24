--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

--- SQLite的AND条件只能使用一个索引, 因此必须建立复合索引.

CREATE INDEX idx_mq_message_mq_id_state_priority_state_updated_at
          ON mq_message(
               mq_id
             , state
             , priority ASC
             , state_updated_at	ASC
             );


DROP INDEX idx_mq_message_state;
DROP INDEX idx_mq_message_hash;
DROP INDEX idx_mq_message_state_updated_at;
DROP INDEX idx_mq_message_priority;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX idx_mq_message_mq_id_state_priority_state_updated_at;

CREATE INDEX idx_mq_message_state
    ON mq_message(state);

CREATE INDEX idx_mq_message_hash
    ON mq_message(hash);

CREATE INDEX idx_mq_message_state_updated_at
    ON mq_message(state_updated_at);

CREATE INDEX idx_mq_message_priority
    ON mq_message(priority);
