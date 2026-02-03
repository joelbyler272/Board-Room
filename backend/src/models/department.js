import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const DepartmentModel = {
  findAll(companyId) {
    if (companyId) {
      return db.prepare('SELECT * FROM departments WHERE company_id = ? ORDER BY name').all(companyId);
    }
    return db.prepare('SELECT * FROM departments ORDER BY name').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM departments WHERE id = ?').get(id);
  },

  findByCompany(companyId) {
    return db.prepare('SELECT * FROM departments WHERE company_id = ? ORDER BY name').all(companyId);
  },

  create(data) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO departments (id, company_id, name, responsibilities, agent_system_prompt, agent_name, avatar_color)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.name,
      data.responsibilities || null,
      data.agent_system_prompt || null,
      data.agent_name || null,
      data.avatar_color || '#3B82F6'
    );
    return this.findById(id);
  },

  update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.responsibilities !== undefined) { fields.push('responsibilities = ?'); values.push(data.responsibilities); }
    if (data.agent_system_prompt !== undefined) { fields.push('agent_system_prompt = ?'); values.push(data.agent_system_prompt); }
    if (data.agent_name !== undefined) { fields.push('agent_name = ?'); values.push(data.agent_name); }
    if (data.avatar_color !== undefined) { fields.push('avatar_color = ?'); values.push(data.avatar_color); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE departments SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM departments WHERE id = ?');
    return stmt.run(id);
  },

  getWithStats(id) {
    const dept = this.findById(id);
    if (!dept) return null;

    const rockCount = db.prepare('SELECT COUNT(*) as count FROM rocks WHERE department_id = ?').get(id).count;
    const issueCount = db.prepare("SELECT COUNT(*) as count FROM issues WHERE department_id = ? AND status IN ('open', 'in_discussion')").get(id).count;
    const todoCount = db.prepare("SELECT COUNT(*) as count FROM todos WHERE department_id = ? AND status = 'pending'").get(id).count;
    const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM messages WHERE department_id = ? AND direction = 'inbound' AND read_at IS NULL").get(id).count;

    return {
      ...dept,
      stats: { rockCount, issueCount, todoCount, unreadMessages }
    };
  }
};
