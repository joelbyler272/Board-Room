import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const CompanyModel = {
  findAll() {
    return db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO companies (id, name, vision, ten_year_target, three_year_picture, one_year_plan, core_values)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.vision || null,
      data.ten_year_target || null,
      data.three_year_picture || null,
      data.one_year_plan || null,
      data.core_values ? JSON.stringify(data.core_values) : null
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.vision !== undefined) { fields.push('vision = ?'); values.push(data.vision); }
    if (data.ten_year_target !== undefined) { fields.push('ten_year_target = ?'); values.push(data.ten_year_target); }
    if (data.three_year_picture !== undefined) { fields.push('three_year_picture = ?'); values.push(data.three_year_picture); }
    if (data.one_year_plan !== undefined) { fields.push('one_year_plan = ?'); values.push(data.one_year_plan); }
    if (data.core_values !== undefined) { fields.push('core_values = ?'); values.push(JSON.stringify(data.core_values)); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE companies SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM companies WHERE id = ?');
    return stmt.run(id);
  }
};
