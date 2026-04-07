const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');

setGlobalOptions({ maxInstances: 10 });

const anthropicKey = defineSecret('ANTHROPIC_KEY');

exports.anthropicProxy = onCall(
  { secrets: [anthropicKey], cors: ['https://jacobs-cookbook.web.app'] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to use the AI Kitchen.');
    }

    const { messages, system, model, max_tokens } = request.data;

    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey.value(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ messages, system, model, max_tokens }),
      });
    } catch (e) {
      throw new HttpsError('internal', 'Failed to reach Anthropic: ' + e.message);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new HttpsError('internal', err.error?.message || `Anthropic API error ${res.status}`);
    }

    return res.json();
  }
);
