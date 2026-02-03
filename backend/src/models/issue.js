import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const IssueModel = {
  findAll(filters = {}) {
    let query = `
      SELECT i.*, d.name as department_name, sd.name as surfaced_by_name
      FROM issues i
      LEFT JOIN departments d ON i.department_id = d.id
      LEFT JOIN departments sd ON i.surfaced_by = sd.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.company_id) {
      query += ' AND i.company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.department_id) {
      query += ' AND i.department_id = ?';
      params.push(filters.department_id);
    }
    if (filters.status) {
      query += ' AND i.status = ?';
      params.push(filters.status);
    }
    if (filters.priority) {
      query += ' AND i.priority = ?';
      params.push(filters.priority);
    }

    query += ' ORDER BY i.priority ASC, i.created_at DESC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT i.*, d.name as department_name, sd.name as surfaced_by_name
      FROM issues i
      LEFT JOIN departments d ON i.department_id = d.id
      LEFT JOIN departments sd ON i.surfaced_by = sd.id
      WHERE i.id = ?
    `).get(id);
  },

  findByCompany(companyId, includeResolved = false) {
    const statusFilter = includeResolved ? '' : "AND i.status IN ('open', 'in_discussion')";
    return db.prepare(`
      SELECT i.*, d.name as department_name
      FROM issues i
      LEFT JOIN departments d ON i.department_id = d.id
      WHERE i.company_id = ? ${statusFilter}
      ORDER BY i.priority ASC, i.created_at DESC
    `).all(companyId);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO issues (id, company_id, department_id, surfaced_by, title, description, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id || null,
      data.surfaced_by || null,
      data.title,
      data.description || null,
      data.priority || 2,
      data.status || 'open'
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.resolution !== undefined) { fields.push('resolution = ?'); values.push(data.resolution); }
    if (data.department_id !== undefined) { fields.push('department_id = ?'); values.push(data.department_id); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE issues SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM issues WHERE id = ?');
    return stmt.run(id);
  },

  startDiscussion(id) {
    return this.update(id, { status: 'in_discussion' });
  },

  solve(id, resolution) {
    return this.update(id, { status: 'solved', resolution });
  },

  drop(id) {
    return this.update(id, { status: 'dropped' });
  },

  getStats(companyId) {
    const results = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM issues
      WHERE company_id = ?
      GROUP BY status
    `).all(companyId);

    return results.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, { open: 0, in_discussion: 0, solved: 0, dropped: 0 });
  }
};
