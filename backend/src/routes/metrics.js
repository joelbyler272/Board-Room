import { Router } from 'express';
import { MetricModel } from '../models/metric.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/metrics
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, week, status } = req.query;
  const metrics = MetricModel.findAll({ company_id, department_id, week, status });
  // Parse trend JSON
  const parsed = metrics.map(m => ({
    ...m,
    trend: m.trend ? JSON.parse(m.trend) : []
  }));
  res.json(parsed);
}));

// GET /api/metrics/scorecard
router.get('/scorecard', asyncHandler(async (req, res) => {
  const { company_id, week } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const scorecard = MetricModel.getScorecard(company_id, week);
  // Parse trend JSON in each metric
  for (const dept of Object.keys(scorecard.byDepartment)) {
    scorecard.byDepartment[dept] = scorecard.byDepartment[dept].map(m => ({
      ...m,
      trend: m.trend ? JSON.parse(m.trend) : []
    }));
  }
  res.json(scorecard);
}));

// GET /api/metrics/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const metric = MetricModel.findById(req.params.id);
  if (!metric) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  metric.trend = metric.trend ? JSON.parse(metric.trend) : [];
  res.json(metric);
}));

// POST /api/metrics
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.name) {
    return res.status(400).json({ error: 'company_id and name are required' });
  }
  const metric = MetricModel.create(req.body);
  metric.trend = metric.trend ? JSON.parse(metric.trend) : [];
  res.status(201).json(metric);
}));

// PUT /api/metrics/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = MetricModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  const metric = MetricModel.update(req.params.id, req.body);
  metric.trend = metric.trend ? JSON.parse(metric.trend) : [];
  res.json(metric);
}));

// POST /api/metrics/:id/update-value
router.post('/:id/update-value', asyncHandler(async (req, res) => {
  const existing = MetricModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  if (req.body.value === undefined) {
    return res.status(400).json({ error: 'value is required' });
  }
  const metric = MetricModel.updateValue(req.params.id, req.body.value);
  metric.trend = metric.trend ? JSON.parse(metric.trend) : [];
  res.json(metric);
}));

// DELETE /api/metrics/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = MetricModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  MetricModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
