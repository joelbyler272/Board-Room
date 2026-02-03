import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const RockModel = {
  findAll(filters = {}) {
    let query = 'SELECT r.*, d.name as department_name FROM rocks r LEFT JOIN departments d ON r.department_id = d.id WHERE 1=1';
    const params = [];

    if (filters.company_id) {
      query += ' AND r.company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.department_id) {
      query += ' AND r.department_id = ?';
      params.push(filters.department_id);
    }
    if (filters.quarter) {
      query += ' AND r.quarter = ?';
      params.push(filters.quarter);
    }
    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY r.created_at DESC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT r.*, d.name as department_name
      FROM rocks r
      LEFT JOIN departments d ON r.department_id = d.id
      WHERE r.id = ?
    `).get(id);
  },

  findByCompany(companyId, quarter) {
    let query = 'SELECT r.*, d.name as department_name FROM rocks r LEFT JOIN departments d ON r.department_id = d.id WHERE r.company_id = ?';
    const params = [companyId];

    if (quarter) {
      query += ' AND r.quarter = ?';
      params.push(quarter);
    }

    query += ' ORDER BY r.status, r.created_at DESC';
    return db.prepare(query).all(...params);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO rocks (id, company_id, department_id, title, description, quarter, status, owner, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id || null,
      data.title,
      data.description || null,
      data.quarter,
      data.status || 'on_track',
      data.owner || null,
      data.due_date || null
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.quarter !== undefined) { fields.push('quarter = ?'); values.push(data.quarter); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.owner !== undefined) { fields.push('owner = ?'); values.push(data.owner); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }
    if (data.department_id !== undefined) { fields.push('department_id = ?'); values.push(data.department_id); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE rocks SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM rocks WHERE id = ?');
    return stmt.run(id);
  },

  getStats(companyId, quarter) {
    const query = quarter
      ? 'SELECT status, COUNT(*) as count FROM rocks WHERE company_id = ? AND quarter = ? GROUP BY status'
      : 'SELECT status, COUNT(*) as count FROM rocks WHERE company_id = ? GROUP BY status';

    const params = quarter ? [companyId, quarter] : [companyId];
    const results = db.prepare(query).all(...params);

    return results.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, { on_track: 0, off_track: 0, completed: 0, dropped: 0 });
  }
};
