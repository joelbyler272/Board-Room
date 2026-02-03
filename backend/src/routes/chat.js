import { Router } from 'express';
import { ClaudeService } from '../services/claude.js';
import { AgentContextService } from '../services/agent-context.js';
import { ResponseParserService } from '../services/response-parser.js';
import { MessageModel } from '../models/message.js';
import { DepartmentModel } from '../models/department.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

// POST /api/chat/:departmentId
router.post('/:departmentId', asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { message, company_id } = req.body;

  if (!message || !company_id) {
    return res.status(400).json({ error: 'message and company_id are required' });
  }

  const department = DepartmentModel.findById(departmentId);
  if (!department) {
    return res.status(404).json({ error: 'Department not found' });
  }

  // Build context for the agent
  const context = AgentContextService.buildAgentContext(departmentId, company_id);
  if (!context) {
    return res.status(400).json({ error: 'Could not build agent context' });
  }

  const systemPrompt = AgentContextService.buildSystemPrompt(context);

  // Save user message
  const userMessage = MessageModel.create({
    company_id,
    department_id: departmentId,
    direction: 'outbound',
    type: 'chat',
    content: JSON.stringify({ text: message })
  });

  // Get conversation history
  const history = AgentContextService.getConversationHistory(departmentId, 20);

  // Call Claude
  const response = await ClaudeService.chat(systemPrompt, history);

  // Parse response for ISSUE: and TODO: items
  const createdItems = ResponseParserService.parseResponse(response.content, {
    company_id,
    department_id: departmentId
  });

  // Clean up response for display
  const cleanedContent = ResponseParserService.cleanResponse(response.content);

  // Save assistant message
  const assistantMessage = MessageModel.create({
    company_id,
    department_id: departmentId,
    direction: 'inbound',
    type: 'chat',
    content: JSON.stringify({
      text: cleanedContent,
      createdItems
    })
  });

  res.json({
    message: {
      ...assistantMessage,
      content: {
        text: cleanedContent,
        createdItems
      }
    },
    createdItems,
    usage: response.usage
  });
}));

// POST /api/chat/:departmentId/stream
router.post('/:departmentId/stream', asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { message, company_id } = req.body;

  if (!message || !company_id) {
    return res.status(400).json({ error: 'message and company_id are required' });
  }

  const department = DepartmentModel.findById(departmentId);
  if (!department) {
    return res.status(404).json({ error: 'Department not found' });
  }

  // Build context for the agent
  const context = AgentContextService.buildAgentContext(departmentId, company_id);
  if (!context) {
    return res.status(400).json({ error: 'Could not build agent context' });
  }

  const systemPrompt = AgentContextService.buildSystemPrompt(context);

  // Save user message
  MessageModel.create({
    company_id,
    department_id: departmentId,
    direction: 'outbound',
    type: 'chat',
    content: JSON.stringify({ text: message })
  });

  // Get conversation history
  const history = AgentContextService.getConversationHistory(departmentId, 20);

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Stream response
  const response = await ClaudeService.streamChat(systemPrompt, history, (chunk) => {
    res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
  });

  // Parse response for ISSUE: and TODO: items
  const createdItems = ResponseParserService.parseResponse(response.content, {
    company_id,
    department_id: departmentId
  });

  // Clean up response for display
  const cleanedContent = ResponseParserService.cleanResponse(response.content);

  // Save assistant message
  const assistantMessage = MessageModel.create({
    company_id,
    department_id: departmentId,
    direction: 'inbound',
    type: 'chat',
    content: JSON.stringify({
      text: cleanedContent,
      createdItems
    })
  });

  // Send final message with metadata
  res.write(`data: ${JSON.stringify({
    type: 'done',
    message: {
      ...assistantMessage,
      content: {
        text: cleanedContent,
        createdItems
      }
    },
    createdItems,
    usage: response.usage
  })}\n\n`);

  res.end();
}));

export default router;
