import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const MetricModel = {
  findAll(filters = {}) {
    let query = `
      SELECT m.*, d.name as department_name
      FROM metrics m
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.company_id) {
      query += ' AND m.company_id = ?';
      params.push(filters.company_id);
    }
    if (filters.department_id) {
      query += ' AND m.department_id = ?';
      params.push(filters.department_id);
    }
    if (filters.week) {
      query += ' AND m.week = ?';
      params.push(filters.week);
    }
    if (filters.status) {
      query += ' AND m.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY m.department_id, m.name';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT m.*, d.name as department_name
      FROM metrics m
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.id = ?
    `).get(id);
  },

  findByCompany(companyId, week) {
    let query = `
      SELECT m.*, d.name as department_name
      FROM metrics m
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.company_id = ?
    `;
    const params = [companyId];

    if (week) {
      query += ' AND m.week = ?';
      params.push(week);
    }

    query += ' ORDER BY d.name, m.name';
    return db.prepare(query).all(...params);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO metrics (id, company_id, department_id, name, description, target, current_value, unit, status, week, trend)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id || null,
      data.name,
      data.description || null,
      data.target || null,
      data.current_value || null,
      data.unit || null,
      data.status || 'on_track',
      data.week || null,
      data.trend ? JSON.stringify(data.trend) : null
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.target !== undefined) { fields.push('target = ?'); values.push(data.target); }
    if (data.current_value !== undefined) { fields.push('current_value = ?'); values.push(data.current_value); }
    if (data.unit !== undefined) { fields.push('unit = ?'); values.push(data.unit); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.week !== undefined) { fields.push('week = ?'); values.push(data.week); }
    if (data.trend !== undefined) { fields.push('trend = ?'); values.push(JSON.stringify(data.trend)); }
    if (data.department_id !== undefined) { fields.push('department_id = ?'); values.push(data.department_id); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE metrics SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM metrics WHERE id = ?');
    return stmt.run(id);
  },

  updateValue(id, value) {
    const metric = this.findById(id);
    if (!metric) return null;

    // Calculate new status
    let status = 'on_track';
    if (metric.target) {
      const ratio = value / metric.target;
      if (ratio < 0.8) status = 'off_track';
      else if (ratio < 0.95) status = 'at_risk';
    }

    // Update trend
    let trend = metric.trend ? JSON.parse(metric.trend) : [];
    trend.push({ value, date: new Date().toISOString() });
    if (trend.length > 12) trend = trend.slice(-12);

    return this.update(id, { current_value: value, status, trend });
  },

  getScorecard(companyId, week) {
    const metrics = this.findByCompany(companyId, week);

    // Group by department
    const byDepartment = {};
    for (const metric of metrics) {
      const deptName = metric.department_name || 'Company';
      if (!byDepartment[deptName]) {
        byDepartment[deptName] = [];
      }
      byDepartment[deptName].push(metric);
    }

    // Calculate summary
    const total = metrics.length;
    const onTrack = metrics.filter(m => m.status === 'on_track').length;
    const atRisk = metrics.filter(m => m.status === 'at_risk').length;
    const offTrack = metrics.filter(m => m.status === 'off_track').length;

    return {
      byDepartment,
      summary: { total, onTrack, atRisk, offTrack }
    };
  }
};
