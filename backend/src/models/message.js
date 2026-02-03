import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const MessageModel = {
  findAll(filters = {}) {
    let query = `
      SELECT m.*, d.name as department_name, d.agent_name
      FROM messages m
      JOIN departments d ON m.department_id = d.id
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
    if (filters.direction) {
      query += ' AND m.direction = ?';
      params.push(filters.direction);
    }
    if (filters.type) {
      query += ' AND m.type = ?';
      params.push(filters.type);
    }
    if (filters.unread) {
      query += ' AND m.read_at IS NULL AND m.direction = ?';
      params.push('inbound');
    }

    query += ' ORDER BY m.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT m.*, d.name as department_name, d.agent_name
      FROM messages m
      JOIN departments d ON m.department_id = d.id
      WHERE m.id = ?
    `).get(id);
  },

  findByDepartment(departmentId, limit = 50) {
    return db.prepare(`
      SELECT m.*, d.name as department_name, d.agent_name
      FROM messages m
      JOIN departments d ON m.department_id = d.id
      WHERE m.department_id = ?
      ORDER BY m.created_at ASC
      LIMIT ?
    `).all(departmentId, limit);
  },

  getConversation(departmentId, limit = 50) {
    return db.prepare(`
      SELECT m.*, d.name as department_name, d.agent_name
      FROM messages m
      JOIN departments d ON m.department_id = d.id
      WHERE m.department_id = ?
      ORDER BY m.created_at ASC
      LIMIT ?
    `).all(departmentId, limit);
  },

  create(data) {
    const id = uuidv4();
    const content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
    const stmt = db.prepare(`
      INSERT INTO messages (id, company_id, department_id, direction, type, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.company_id,
      data.department_id,
      data.direction,
      data.type || 'chat',
      content
    );
    return this.findById(id);
  },

  markAsRead(id) {
    const stmt = db.prepare("UPDATE messages SET read_at = datetime('now') WHERE id = ?");
    stmt.run(id);
    return this.findById(id);
  },

  markAllAsRead(departmentId) {
    const stmt = db.prepare(`
      UPDATE messages
      SET read_at = datetime('now')
      WHERE department_id = ? AND direction = 'inbound' AND read_at IS NULL
    `);
    return stmt.run(departmentId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    return stmt.run(id);
  },

  getUnreadCount(companyId) {
    return db.prepare(`
      SELECT COUNT(*) as count
      FROM messages
      WHERE company_id = ? AND direction = 'inbound' AND read_at IS NULL
    `).get(companyId).count;
  },

  getUnreadByDepartment(companyId) {
    return db.prepare(`
      SELECT m.department_id, d.name as department_name, d.agent_name, COUNT(*) as count
      FROM messages m
      JOIN departments d ON m.department_id = d.id
      WHERE m.company_id = ? AND m.direction = 'inbound' AND m.read_at IS NULL
      GROUP BY m.department_id
    `).all(companyId);
  },

  getInbox(companyId, limit = 20) {
    // Get latest message from each department
    return db.prepare(`
      SELECT m.*, d.name as department_name, d.agent_name, d.avatar_color
      FROM messages m
      JOIN departments d ON m.department_id = d.id
      WHERE m.company_id = ?
        AND m.direction = 'inbound'
        AND m.id IN (
          SELECT MAX(id) FROM messages
          WHERE company_id = ? AND direction = 'inbound'
          GROUP BY department_id
        )
      ORDER BY m.created_at DESC
      LIMIT ?
    `).all(companyId, companyId, limit);
  }
};
