import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const TodoModel = {
  findAll(filters = {}) {
    let query = `
      SELECT t.*, d.name as department_name
      FROM todos t
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.company_id) {
      query += ' AND t.company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.department_id) {
      query += ' AND t.department_id = ?';
      params.push(filters.department_id);
    }
    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }
    if (filters.issue_id) {
      query += ' AND t.issue_id = ?';
      params.push(filters.issue_id);
    }

    query += ' ORDER BY t.due_date ASC, t.created_at DESC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT t.*, d.name as department_name
      FROM todos t
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE t.id = ?
    `).get(id);
  },

  findByCompany(companyId, includeCompleted = false) {
    const statusFilter = includeCompleted ? '' : "AND t.status = 'pending'";
    return db.prepare(`
      SELECT t.*, d.name as department_name
      FROM todos t
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE t.company_id = ? ${statusFilter}
      ORDER BY t.due_date ASC, t.created_at DESC
    `).all(companyId);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO todos (id, company_id, department_id, issue_id, title, description, due_date, status, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id || null,
      data.issue_id || null,
      data.title,
      data.description || null,
      data.due_date || null,
      data.status || 'pending',
      data.assigned_to || null
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.assigned_to !== undefined) { fields.push('assigned_to = ?'); values.push(data.assigned_to); }
    if (data.department_id !== undefined) { fields.push('department_id = ?'); values.push(data.department_id); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    return stmt.run(id);
  },

  complete(id) {
    return this.update(id, { status: 'completed' });
  },

  drop(id) {
    return this.update(id, { status: 'dropped' });
  },

  getStats(companyId) {
    const results = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM todos
      WHERE company_id = ?
      GROUP BY status
    `).all(companyId);

    const overdue = db.prepare(`
      SELECT COUNT(*) as count
      FROM todos
      WHERE company_id = ? AND status = 'pending' AND due_date < date('now')
    `).get(companyId).count;

    const stats = results.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, { pending: 0, completed: 0, dropped: 0 });

    stats.overdue = overdue;
    return stats;
  }
};
