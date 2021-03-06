--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 主要目的是优化 renewAllFailedMessages 的性能
CREATE INDEX idx_mq_message_mq_id_state
          ON mq_message(
               mq_id
             , state
             );

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX idx_mq_message_mq_id_state;
