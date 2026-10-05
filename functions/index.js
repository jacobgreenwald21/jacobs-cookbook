const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const Anthropic = require('@anthropic-ai/sdk');

setGlobalOptions({ maxInstances: 10 });

const anthropicKey = defineSecret('ANTHROPIC_KEY');

// Set here, never by the browser, so callers can't pick the model or the token limit.
const MODEL = 'claude-sonnet-5-5';
const MAX_TOKENS = 16000; // thinking counts toward this too
const EFFORT = 'low';     // docs recommend low for chat; raise to medium if drafts get worse

exports.anthropicProxy = onCall(
  { secrets: [anthropicKey], cors: ['https://jacobs-cookbook.web.app'], timeoutSeconds: 120 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to use the AI Kitchen.');
    }

    const { messages, system } = request.data;
    const client = new Anthropic({ apiKey: anthropicKey.value() });

    let response;
    try {
      response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        output_config: { effort: EFFORT },
        // If Sonnet declines a request, the API re-runs it on a fallback model. Shouldn't fire for cooking.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system,
        messages,
      });
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) {
        throw new HttpsError('resource-exhausted', 'The AI Kitchen is busy. Try again in a minute.');
      }
      if (e instanceof Anthropic.APIError) {
        throw new HttpsError('internal', e.message);
      }
      throw new HttpsError('internal', 'Failed to reach Anthropic: ' + e.message);
    }

    const fallbackRan = (response.usage.iterations ?? []).some(i => i.type === 'fallback_message');
    if (fallbackRan) {
      logger.warn('Refusal fallback ran', { servedBy: response.model, stopReason: response.stop_reason });
    }

    return response;
  }
);
