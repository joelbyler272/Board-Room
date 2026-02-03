import { Router } from 'express';
import { DepartmentModel } from '../models/department.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/departments
router.get('/', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  const departments = DepartmentModel.findAll(company_id);
  res.json(departments);
}));

// GET /api/departments/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const department = DepartmentModel.getWithStats(req.params.id);
  if (!department) {
    return res.status(404).json({ error: 'Department not found' });
  }
  res.json(department);
}));

// POST /api/departments
router.post('/', asyncHandler(async (req, res) => {
  const department = DepartmentModel.create(req.body);
  res.status(201).json(department);
}));

// PUT /api/departments/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = DepartmentModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Department not found' });
  }
  const department = DepartmentModel.update(req.params.id, req.body);
  res.json(department);
}));

// DELETE /api/departments/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = DepartmentModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Department not found' });
  }
  DepartmentModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
