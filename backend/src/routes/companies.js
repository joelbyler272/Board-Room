import { Router } from 'express';
import { CompanyModel } from '../models/company.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/companies
router.get('/', asyncHandler(async (req, res) => {
  const companies = CompanyModel.findAll();
  res.json(companies);
}));

// GET /api/companies/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const company = CompanyModel.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  // Parse core_values if it exists
  if (company.core_values) {
    company.core_values = JSON.parse(company.core_values);
  }
  res.json(company);
}));

// POST /api/companies
router.post('/', asyncHandler(async (req, res) => {
  const company = CompanyModel.create(req.body);
  if (company.core_values) {
    company.core_values = JSON.parse(company.core_values);
  }
  res.status(201).json(company);
}));

// PUT /api/companies/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = CompanyModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Company not found' });
  }
  const company = CompanyModel.update(req.params.id, req.body);
  if (company.core_values) {
    company.core_values = JSON.parse(company.core_values);
  }
  res.json(company);
}));

// DELETE /api/companies/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = CompanyModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Company not found' });
  }
  CompanyModel.delete(req.params.id);
  res.status(204).send();
}));

export default router;
