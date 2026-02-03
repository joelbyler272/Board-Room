import { Router } from 'express';
import { MessageModel } from '../models/message.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/messages
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, department_id, direction, type, unread, limit } = req.query;
  const messages = MessageModel.findAll({
    company_id,
    department_id,
    direction,
    type,
    unread: unread === 'true',
    limit: limit ? parseInt(limit) : undefined
  });
  // Parse content JSON
  const parsed = messages.map(m => ({
    ...m,
    content: tryParseJson(m.content)
  }));
  res.json(parsed);
}));

// GET /api/messages/inbox
router.get('/inbox', asyncHandler(async (req, res) => {
  const { company_id, limit } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const messages = MessageModel.getInbox(company_id, limit ? parseInt(limit) : 20);
  const parsed = messages.map(m => ({
    ...m,
    content: tryParseJson(m.content)
  }));
  res.json(parsed);
}));

// GET /api/messages/unread-count
router.get('/unread-count', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const count = MessageModel.getUnreadCount(company_id);
  res.json({ count });
}));

// GET /api/messages/unread-by-department
router.get('/unread-by-department', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const unread = MessageModel.getUnreadByDepartment(company_id);
  res.json(unread);
}));

// GET /api/messages/conversation/:departmentId
router.get('/conversation/:departmentId', asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const messages = MessageModel.getConversation(req.params.departmentId, limit ? parseInt(limit) : 50);
  const parsed = messages.map(m => ({
    ...m,
    content: tryParseJson(m.content)
  }));
  res.json(parsed);
}));

// GET /api/messages/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const message = MessageModel.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  message.content = tryParseJson(message.content);
  res.json(message);
}));

// POST /api/messages
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.department_id || !req.body.direction || !req.body.content) {
    return res.status(400).json({ error: 'company_id, department_id, direction, and content are required' });
  }
  const message = MessageModel.create(req.body);
  message.content = tryParseJson(message.content);
  res.status(201).json(message);
}));

// POST /api/messages/:id/read
router.post('/:id/read', asyncHandler(async (req, res) => {
  const existing = MessageModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Message not found' });
  }
  const message = MessageModel.markAsRead(req.params.id);
  message.content = tryParseJson(message.content);
  res.json(message);
}));

// POST /api/messages/mark-all-read/:departmentId
router.post('/mark-all-read/:departmentId', asyncHandler(async (req, res) => {
  MessageModel.markAllAsRead(req.params.departmentId);
  res.json({ success: true });
}));

// DELETE /api/messages/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = MessageModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Message not found' });
  }
  MessageModel.delete(req.params.id);
  res.status(204).send();
}));

function tryParseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return { text: str };
  }
}

export default router;
