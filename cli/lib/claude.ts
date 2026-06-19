/**
 * Anthropic SDK wrapper for rebel-system CLI
 *
 * Provides a simple interface for calling the Claude API with
 * streaming and non-streaming support.
 *
 * NOTE: The Anthropic SDK is imported dynamically to allow the run command
 * to be used with --dry-run without requiring the SDK to be installed.
 */

import { DEFAULT_MODEL } from './types.js';

// Re-export for convenience
export { DEFAULT_MODEL };

// Lazy-loaded Anthropic client type
type AnthropicClient = import('@anthropic-ai/sdk').default;

// ============================================================================
// Types
// ============================================================================

/**
 * Options for calling Claude.
 */
export interface ClaudeCallOptions {
  /** System prompt to use */
  systemPrompt: string;
  /** User message */
  userMessage: string;
  /** Model to use (default: claude-sonnet-4-20250514) */
  model?: string;
  /** Maximum tokens to generate (default: 8192) */
  maxTokens?: number;
  /** Whether to stream the response (default: true) */
  stream?: boolean;
}

/**
 * Result of a Claude call.
 */
export interface ClaudeCallResult {
  /** Response text */
  text: string;
  /** Input tokens used */
  inputTokens: number;
  /** Output tokens used */
  outputTokens: number;
  /** Stop reason */
  stopReason: string;
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_MAX_TOKENS = 8192;

// ============================================================================
// Claude Client
// ============================================================================

/**
 * Creates an Anthropic client instance.
 *
 * Requires ANTHROPIC_API_KEY environment variable to be set.
 * The SDK is dynamically imported to allow --dry-run without the SDK installed.
 *
 * @returns Anthropic client
 * @throws Error if API key is not set or SDK is not available
 */
export async function createClient(): Promise<AnthropicClient> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is not set.\n' +
        'Set it with: export ANTHROPIC_API_KEY=your-api-key'
    );
  }

  // Dynamic import to allow dry-run without SDK
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    return new Anthropic({ apiKey });
  } catch {
    throw new Error(
      'Failed to load @anthropic-ai/sdk. Make sure to run with the full shebang:\n' +
      '#!/usr/bin/env -S npx -y -p tsx@^4 -p @anthropic-ai/sdk -p nunjucks tsx\n\n' +
      'Or install the package: npm install @anthropic-ai/sdk'
    );
  }
}

// ============================================================================
// Streaming Call
// ============================================================================

/**
 * Calls Claude with streaming, printing chunks to stdout as they arrive.
 *
 * @param client - Anthropic client
 * @param options - Call options
 * @returns Call result with usage stats
 */
export async function callClaudeStreaming(
  client: AnthropicClient,
  options: ClaudeCallOptions
): Promise<ClaudeCallResult> {
  const { systemPrompt, userMessage, model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS } = options;

  let text = '';
  let inputTokens = 0;
  let outputTokens = 0;
  let stopReason = 'unknown';

  const stream = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      const delta = event.delta;
      if ('text' in delta) {
        process.stdout.write(delta.text);
        text += delta.text;
      }
    } else if (event.type === 'message_start') {
      inputTokens = event.message.usage?.input_tokens ?? 0;
    } else if (event.type === 'message_delta') {
      outputTokens = event.usage?.output_tokens ?? 0;
      stopReason = event.delta?.stop_reason ?? 'unknown';
    }
  }

  // Ensure final newline
  if (text && !text.endsWith('\n')) {
    process.stdout.write('\n');
  }

  return {
    text,
    inputTokens,
    outputTokens,
    stopReason,
  };
}

// ============================================================================
// Non-Streaming Call
// ============================================================================

/**
 * Calls Claude without streaming, waiting for the complete response.
 *
 * @param client - Anthropic client
 * @param options - Call options
 * @returns Call result with response text and usage stats
 */
export async function callClaudeSync(
  client: AnthropicClient,
  options: ClaudeCallOptions
): Promise<ClaudeCallResult> {
  const { systemPrompt, userMessage, model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS } = options;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  // Extract text from content blocks
  let text = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text;
    }
  }

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason ?? 'unknown',
  };
}

// ============================================================================
// Unified Call Function
// ============================================================================

/**
 * Calls Claude with either streaming or non-streaming mode.
 *
 * @param options - Call options (including stream flag)
 * @returns Call result
 */
export async function callClaude(options: ClaudeCallOptions): Promise<ClaudeCallResult> {
  const client = await createClient();
  const stream = options.stream !== false; // Default to streaming

  if (stream) {
    return callClaudeStreaming(client, options);
  } else {
    return callClaudeSync(client, options);
  }
}
