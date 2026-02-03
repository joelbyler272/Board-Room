import { Router } from 'express';
import { TodoModel } from '../models/todo.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/todos
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, status, issue_id } = req.query;
  const todos = TodoModel.findAll({ company_id, department_id, status, issue_id });
  res.json(todos);
}));

// GET /api/todos/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const stats = TodoModel.getStats(company_id);
  res.json(stats);
}));

// GET /api/todos/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const todo = TodoModel.findById(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
}));

// POST /api/todos
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.title) {
    return res.status(400).json({ error: 'company_id and title are required' });
  }
  const todo = TodoModel.create(req.body);
  res.status(201).json(todo);
}));

// PUT /api/todos/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = TodoModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const todo = TodoModel.update(req.params.id, req.body);
  res.json(todo);
}));

// POST /api/todos/:id/complete
router.post('/:id/complete', asyncHandler(async (req, res) => {
  const existing = TodoModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const todo = TodoModel.complete(req.params.id);
  res.json(todo);
}));

// POST /api/todos/:id/drop
router.post('/:id/drop', asyncHandler(async (req, res) => {
  const existing = TodoModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const todo = TodoModel.drop(req.params.id);
  res.json(todo);
}));

// DELETE /api/todos/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = TodoModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  TodoModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
