import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const L10_SECTIONS = ['segue', 'scorecard', 'rocks', 'headlines', 'todos', 'ids', 'conclude'];

export const MeetingModel = {
  findAll(filters = {}) {
    let query = 'SELECT * FROM meetings WHERE 1=1';
    const params = [];

    if (filters.company_id) {
      query += ' AND company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare('SELECT * FROM meetings WHERE id = ?').get(id);
  },

  findByCompany(companyId) {
    return db.prepare(`
      SELECT * FROM meetings
      WHERE company_id = ?
      ORDER BY created_at DESC
    `).all(companyId);
  },

  findActive(companyId) {
    return db.prepare(`
      SELECT * FROM meetings
      WHERE company_id = ? AND status = 'in_progress'
      ORDER BY created_at DESC
      LIMIT 1
    `).get(companyId);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO meetings (id, company_id, type, status, current_section, attendees, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.type,
      data.status || 'scheduled',
      data.current_section || null,
      data.attendees ? JSON.stringify(data.attendees) : null,
      data.notes || null
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.current_section !== undefined) { fields.push('current_section = ?'); values.push(data.current_section); }
    if (data.started_at !== undefined) { fields.push('started_at = ?'); values.push(data.started_at); }
    if (data.completed_at !== undefined) { fields.push('completed_at = ?'); values.push(data.completed_at); }
    if (data.summary !== undefined) { fields.push('summary = ?'); values.push(JSON.stringify(data.summary)); }
    if (data.attendees !== undefined) { fields.push('attendees = ?'); values.push(JSON.stringify(data.attendees)); }
    if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE meetings SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM meetings WHERE id = ?');
    return stmt.run(id);
  },

  start(id) {
    return this.update(id, {
      status: 'in_progress',
      started_at: new Date().toISOString(),
      current_section: 'segue'
    });
  },

  nextSection(id) {
    const meeting = this.findById(id);
    if (!meeting || meeting.status !== 'in_progress') return null;

    const currentIndex = L10_SECTIONS.indexOf(meeting.current_section);
    if (currentIndex === -1 || currentIndex >= L10_SECTIONS.length - 1) {
      return this.complete(id);
    }

    return this.update(id, { current_section: L10_SECTIONS[currentIndex + 1] });
  },

  previousSection(id) {
    const meeting = this.findById(id);
    if (!meeting || meeting.status !== 'in_progress') return null;

    const currentIndex = L10_SECTIONS.indexOf(meeting.current_section);
    if (currentIndex <= 0) return meeting;

    return this.update(id, { current_section: L10_SECTIONS[currentIndex - 1] });
  },

  goToSection(id, section) {
    if (!L10_SECTIONS.includes(section)) return null;
    return this.update(id, { current_section: section });
  },

  complete(id, summary = {}) {
    return this.update(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      current_section: null,
      summary
    });
  },

  cancel(id) {
    return this.update(id, { status: 'cancelled' });
  },

  getRecent(companyId, limit = 10) {
    return db.prepare(`
      SELECT * FROM meetings
      WHERE company_id = ? AND status = 'completed'
      ORDER BY completed_at DESC
      LIMIT ?
    `).all(companyId, limit);
  },

  getSections() {
    return L10_SECTIONS;
  }
};
