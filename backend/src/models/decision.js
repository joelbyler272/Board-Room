import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const DecisionModel = {
  findAll(filters = {}) {
    let query = `
      SELECT d.*, dept.name as department_name
      FROM decisions d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.company_id) {
      query += ' AND d.company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.department_id) {
      query += ' AND d.department_id = ?';
      params.push(filters.department_id);
    }
    if (filters.issue_id) {
      query += ' AND d.issue_id = ?';
      params.push(filters.issue_id);
    }

    query += ' ORDER BY d.created_at DESC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT d.*, dept.name as department_name
      FROM decisions d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = ?
    `).get(id);
  },

  findByCompany(companyId) {
    return db.prepare(`
      SELECT d.*, dept.name as department_name
      FROM decisions d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.company_id = ?
      ORDER BY d.created_at DESC
    `).all(companyId);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO decisions (id, company_id, department_id, issue_id, context, decision, rationale, made_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id || null,
      data.issue_id || null,
      data.context,
      data.decision,
      data.rationale || null,
      data.made_by || null
    );
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM decisions WHERE id = ?');
    return stmt.run(id);
  },

  getRecent(companyId, limit = 10) {
    return db.prepare(`
      SELECT d.*, dept.name as department_name
      FROM decisions d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.company_id = ?
      ORDER BY d.created_at DESC
      LIMIT ?
    `).all(companyId, limit);
  }
};
