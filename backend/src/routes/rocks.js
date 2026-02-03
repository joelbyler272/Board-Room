import { Router } from 'express';
import { RockModel } from '../models/rock.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/rocks
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, quarter, status } = req.query;
  const rocks = RockModel.findAll({ company_id, department_id, quarter, status });
  res.json(rocks);
}));

// GET /api/rocks/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const { company_id, quarter } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const stats = RockModel.getStats(company_id, quarter);
  res.json(stats);
}));

// GET /api/rocks/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const rock = RockModel.findById(req.params.id);
  if (!rock) {
    return res.status(404).json({ error: 'Rock not found' });
  }
  res.json(rock);
}));

// POST /api/rocks
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.title || !req.body.quarter) {
    return res.status(400).json({ error: 'company_id, title, and quarter are required' });
  }
  const rock = RockModel.create(req.body);
  res.status(201).json(rock);
}));

// PUT /api/rocks/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = RockModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Rock not found' });
  }
  const rock = RockModel.update(req.params.id, req.body);
  res.json(rock);
}));

// DELETE /api/rocks/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = RockModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Rock not found' });
  }
  RockModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
