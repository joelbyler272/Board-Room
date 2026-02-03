import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.js';

// Import routes
import companiesRouter from './routes/companies.js';
import departmentsRouter from './routes/departments.js';
import rocksRouter from './routes/rocks.js';
import issuesRouter from './routes/issues.js';
import todosRouter from './routes/todos.js';
import decisionsRouter from './routes/decisions.js';
import messagesRouter from './routes/messages.js';
import metricsRouter from './routes/metrics.js';
import meetingsRouter from './routes/meetings.js';
import chatRouter from './routes/chat.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/companies', companiesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/rocks', rocksRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/todos', todosRouter);
app.use('/api/decisions', decisionsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/chat', chatRouter);

// Error handling
app.use(errorHandler);

export default app;
