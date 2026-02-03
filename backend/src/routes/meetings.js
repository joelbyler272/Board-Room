import { Router } from 'express';
import { MeetingModel } from '../models/meeting.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// GET /api/meetings
router.get('/', asyncHandler(async (req, res) => {
  const { company_id, type, status } = req.query;
  const meetings = MeetingModel.findAll({ company_id, type, status });
  // Parse JSON fields
  const parsed = meetings.map(parseMeeting);
  res.json(parsed);
}));

// GET /api/meetings/active
router.get('/active', asyncHandler(async (req, res) => {
  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const meeting = MeetingModel.findActive(company_id);
  res.json(meeting ? parseMeeting(meeting) : null);
}));

// GET /api/meetings/recent
router.get('/recent', asyncHandler(async (req, res) => {
  const { company_id, limit } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
  }
  const meetings = MeetingModel.getRecent(company_id, limit ? parseInt(limit) : 10);
  const parsed = meetings.map(parseMeeting);
  res.json(parsed);
}));

// GET /api/meetings/sections
router.get('/sections', asyncHandler(async (req, res) => {
  const sections = MeetingModel.getSections();
  res.json(sections);
}));

// GET /api/meetings/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const meeting = MeetingModel.findById(req.params.id);
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.company_id || !req.body.type) {
    return res.status(400).json({ error: 'company_id and type are required' });
  }
  const meeting = MeetingModel.create(req.body);
  res.status(201).json(parseMeeting(meeting));
}));

// PUT /api/meetings/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.update(req.params.id, req.body);
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/start
router.post('/:id/start', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.start(req.params.id);
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/next-section
router.post('/:id/next-section', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.nextSection(req.params.id);
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/previous-section
router.post('/:id/previous-section', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.previousSection(req.params.id);
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/go-to-section
router.post('/:id/go-to-section', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  if (!req.body.section) {
    return res.status(400).json({ error: 'section is required' });
  }
  const meeting = MeetingModel.goToSection(req.params.id, req.body.section);
  if (!meeting) {
    return res.status(400).json({ error: 'Invalid section' });
  }
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/complete
router.post('/:id/complete', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.complete(req.params.id, req.body.summary);
  res.json(parseMeeting(meeting));
}));

// POST /api/meetings/:id/cancel
router.post('/:id/cancel', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  const meeting = MeetingModel.cancel(req.params.id);
  res.json(parseMeeting(meeting));
}));

// DELETE /api/meetings/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = MeetingModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  MeetingModel.delete(req.params.id);
  res.status(204).send();
}));

function parseMeeting(meeting) {
  return {
    ...meeting,
    summary: meeting.summary ? JSON.parse(meeting.summary) : null,
    attendees: meeting.attendees ? JSON.parse(meeting.attendees) : []
  };
}

export default router;
