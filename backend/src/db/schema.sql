-- Board Room Database Schema

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  vision TEXT,
  ten_year_target TEXT,
  three_year_picture TEXT,
  one_year_plan TEXT,
  core_values TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  responsibilities TEXT,
  agent_system_prompt TEXT,
  agent_name TEXT,
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Rocks table (quarterly goals)
CREATE TABLE IF NOT EXISTS rocks (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  quarter TEXT NOT NULL, -- e.g., "2025-Q1"
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'off_track', 'completed', 'dropped')),
  owner TEXT,
  due_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT,
  surfaced_by TEXT, -- department_id or 'user'
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 2 CHECK (priority IN (1, 2, 3)), -- 1=high, 2=medium, 3=low
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_discussion', 'solved', 'dropped')),
  resolution TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT,
  issue_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dropped')),
  assigned_to TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE SET NULL
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT,
  issue_id TEXT,
  context TEXT NOT NULL,
  decision TEXT NOT NULL,
  rationale TEXT,
  made_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE SET NULL
);

-- Messages table (agent conversations)
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')), -- inbound=from agent, outbound=to agent
  type TEXT DEFAULT 'chat' CHECK (type IN ('chat', 'report', 'alert', 'system')),
  content TEXT NOT NULL, -- JSON: { text, suggestions?, attachments? }
  read_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Metrics table (scorecard)
CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  department_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  target REAL,
  current_value REAL,
  unit TEXT, -- e.g., '%', '$', 'count'
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'off_track', 'at_risk')),
  week TEXT, -- e.g., "2025-W01"
  trend TEXT, -- JSON array of recent values
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('l10', 'quarterly', 'annual', 'one_on_one')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  current_section TEXT, -- For L10: 'segue', 'scorecard', 'rocks', 'headlines', 'todos', 'ids', 'conclude'
  started_at TEXT,
  completed_at TEXT,
  summary TEXT, -- JSON: { segue, scorecard, headlines, ids_resolved, todos_created, rating }
  attendees TEXT, -- JSON array of department_ids
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_departments_company ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_rocks_company ON rocks(company_id);
CREATE INDEX IF NOT EXISTS idx_rocks_department ON rocks(department_id);
CREATE INDEX IF NOT EXISTS idx_rocks_status ON rocks(status);
CREATE INDEX IF NOT EXISTS idx_issues_company ON issues(company_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_todos_company ON todos(company_id);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_messages_department ON messages(department_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_metrics_department ON metrics(department_id);
CREATE INDEX IF NOT EXISTS idx_meetings_company ON meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
