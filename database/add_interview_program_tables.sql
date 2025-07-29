-- Create interview_requests table
CREATE TABLE IF NOT EXISTS interview_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organization TEXT,
    topic TEXT NOT NULL,
    description TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create program_proposals table
CREATE TABLE IF NOT EXISTS program_proposals (
    id TEXT PRIMARY KEY,
    proposer_name TEXT NOT NULL,
    proposer_email TEXT NOT NULL,
    proposer_phone TEXT,
    organization TEXT,
    program_title TEXT NOT NULL,
    program_description TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT,
    target_audience TEXT,
    proposed_schedule TEXT,
    resources TEXT,
    experience TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);