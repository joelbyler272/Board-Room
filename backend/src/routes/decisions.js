import { Router } from 'express';
import { DecisionModel } from '../models/decision.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/decisions
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, issue_id } = req.query;
  const decisions = DecisionModel.findAll({ company_id, department_id, issue_id });
  res.json(decisions);
}));

// GET /api/decisions/recent
router.get('/recent', asyncHandler(async (req, res) => {
  const { company_id, limit } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const decisions = DecisionModel.getRecent(company_id, limit ? parseInt(limit) : 10);
  res.json(decisions);
}));

// GET /api/decisions/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const decision = DecisionModel.findById(req.params.id);
  if (!decision) {
    return res.status(404).json({ error: 'Decision not found' });
  }
  res.json(decision);
}));

// POST /api/decisions
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.context || !req.body.decision) {
    return res.status(400).json({ error: 'company_id, context, and decision are required' });
  }
  const decision = DecisionModel.create(req.body);
  res.status(201).json(decision);
}));

// DELETE /api/decisions/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = DecisionModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Decision not found' });
  }
  DecisionModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
