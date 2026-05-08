 -- add user_count column to rooms table if it doesn't exist
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_location  VARCHAR(127) DEFAULT '';
ALTER TABLE rooms DROP COLUMN IF EXISTS max_capacity;
ALTER TABLE rooms DROP COLUMN IF EXISTS is_silent;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(32) DEFAULT '0.svg';
