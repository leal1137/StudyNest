-- Drop old tables
DROP TABLE IF EXISTS room_participants;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- Users table with password
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    user_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    room_location VARCHAR(127) DEFAULT ''
);
 -- add user_count column to rooms table if it doesn't exist
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_location  VARCHAR(127) DEFAULT '';
