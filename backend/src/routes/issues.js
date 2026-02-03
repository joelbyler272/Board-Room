import { Router } from 'express';
import { IssueModel } from '../models/issue.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/issues
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, status, priority } = req.query;
  const issues = IssueModel.findAll({ company_id, department_id, status, priority: priority ? parseInt(priority) : undefined });
  res.json(issues);
}));

// GET /api/issues/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const stats = IssueModel.getStats(company_id);
  res.json(stats);
}));

// GET /api/issues/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const issue = IssueModel.findById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json(issue);
}));

// POST /api/issues
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.title) {
    return res.status(400).json({ error: 'company_id and title are required' });
  }
  const issue = IssueModel.create(req.body);
  res.status(201).json(issue);
}));

// PUT /api/issues/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = IssueModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  const issue = IssueModel.update(req.params.id, req.body);
  res.json(issue);
}));

// POST /api/issues/:id/start-discussion
router.post('/:id/start-discussion', asyncHandler(async (req, res) => {
  const existing = IssueModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  const issue = IssueModel.startDiscussion(req.params.id);
  res.json(issue);
}));

// POST /api/issues/:id/solve
router.post('/:id/solve', asyncHandler(async (req, res) => {
  const existing = IssueModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  const issue = IssueModel.solve(req.params.id, req.body.resolution);
  res.json(issue);
}));

// POST /api/issues/:id/drop
router.post('/:id/drop', asyncHandler(async (req, res) => {
  const existing = IssueModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  const issue = IssueModel.drop(req.params.id);
  res.json(issue);
}));

// DELETE /api/issues/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = IssueModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  IssueModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
