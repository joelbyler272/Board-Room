import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  dbPath: process.env.DB_PATH || './data/board-room.db',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'
};
