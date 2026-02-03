import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/index.js';

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

export async function chat(systemPrompt, messages, options = {}) {
  const { maxTokens = 1024, temperature = 0.7 } = options;

  try {
    const response = await anthropic.messages.create({
      model: config.claudeModel,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature,
    });

    return {
      content: response.content[0].text,
      usage: response.usage,
      stopReason: response.stop_reason
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

export async function streamChat(systemPrompt, messages, onChunk, options = {}) {
  const { maxTokens = 1024, temperature = 0.7 } = options;

  try {
    const stream = await anthropic.messages.stream({
      model: config.claudeModel,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature,
    });

    let fullContent = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullContent += event.delta.text;
        if (onChunk) {
          onChunk(event.delta.text);
        }
      }
    }

    const finalMessage = await stream.finalMessage();

    return {
      content: fullContent,
      usage: finalMessage.usage,
      stopReason: finalMessage.stop_reason
    };
  } catch (error) {
    console.error('Claude streaming error:', error);
    throw error;
  }
}

export const ClaudeService = {
  chat,
  streamChat
};
