import { IssueModel } from '../models/issue.js';
import { TodoModel } from '../models/todo.js';

const ISSUE_PATTERN = /ISSUE:\s*(.+?)(?=\n|TODO:|ISSUE:|$)/gi;
const TODO_PATTERN = /TODO:\s*(.+?)(?=\n|TODO:|ISSUE:|$)/gi;

export function parseResponse(content, context) {
  const { company_id, department_id } = context;
  const createdItems = {
    issues: [],
    todos: []
  };

  // Extract issues
  let match;
  while ((match = ISSUE_PATTERN.exec(content)) !== null) {
    const title = match[1].trim();
    if (title) {
      try {
        const issue = IssueModel.create({
          company_id,
          department_id,
          surfaced_by: department_id,
          title,
          priority: 2,
          status: 'open'
        });
        createdItems.issues.push(issue);
      } catch (error) {
        console.error('Error creating issue:', error);
      }
    }
  }

  // Extract todos
  while ((match = TODO_PATTERN.exec(content)) !== null) {
    const title = match[1].trim();
    if (title) {
      try {
        // Calculate due date (default: 7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const todo = TodoModel.create({
          company_id,
          department_id,
          title,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending'
        });
        createdItems.todos.push(todo);
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  }

  return createdItems;
}

export function cleanResponse(content) {
  // Remove ISSUE: and TODO: prefixes for cleaner display
  // but keep the actual content
  return content
    .replace(/ISSUE:\s*/gi, '**Issue identified:** ')
    .replace(/TODO:\s*/gi, '**Action item:** ');
}

export const ResponseParserService = {
  parseResponse,
  cleanResponse
};
