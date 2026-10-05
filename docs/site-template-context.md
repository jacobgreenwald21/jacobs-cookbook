# Firebase Single-File App — Site Template Context
*Extracted from Jacob's Cookbook | April 2026*

---

## What This Document Is

A complete, copy-paste-ready reference for building new web apps using the same architecture as Jacob's Cookbook. Every pattern, CSS variable, component, and JS function is documented here so future apps can be spun up quickly without rebuilding from scratch.

The core idea: **a single HTML file** with Firebase CDN scripts, no build step, no Node environment required. Deploy with one terminal command.

---

## Stack

- **HTML/CSS/JS** — single file, no framework, no bundler
- **Firebase compat SDK v10.12.0** — loaded via CDN script tags
- **Firebase Hosting** — static file hosting with a live HTTPS URL
- **Firestore** — real-time NoSQL database
- **Firebase Auth** — Google sign-in
- **Anthropic API** — optional, for AI-powered features (called directly from the browser)
- **GitHub** — version control with `main` (live) / `dev` (development) branch strategy

---

## File Structure

```
project-name/
├── index.html               ← entire app lives here
├── firebase.json            ← Firebase Hosting config
├── README.md
├── CHANGELOG.md
├── docs/
│   ├── decisions.md
│   └── launch-notes.md
└── archive/
    └── README.md
```

### firebase.json (minimal)
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

---

## HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>App Name</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  /* CSS goes here */
</style>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
</head>
<body>
  <!-- HTML goes here -->
<script>
  // JS goes here
</script>
</body>
</html>
```

---

## Design System

### CSS Variables (Dark Theme)

```css
:root {
  --bg: #0f0f0f;
  --surface: #1a1a1a;
  --surface2: #222222;
  --border: #2e2e2e;
  --border2: #3a3a3a;
  --text: #e8e4dc;
  --text2: #9a9590;
  --text3: #6a6560;
  --accent: #c8a96e;       /* gold — primary interactive color */
  --accent2: #a07c3e;      /* gold dark — hover state */
  --green: #4a8c5c;        /* success / publish / confirm */
  --red: #8c4a4a;          /* danger / delete */
  --radius: 8px;
  --radius-lg: 14px;
}
```

### Typography

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
}
h1, h2, h3, h4 {
  font-family: 'Lora', serif;
  font-weight: 500;
  line-height: 1.3;
}
```

- **Body:** DM Sans, 15px, weight 300/400/500
- **Headings:** Lora serif, weight 400/500/600, italic variant available
- **Gold accent (`--accent`):** used for interactive elements, active states, brand moments
- **Muted text (`--text2`, `--text3`):** secondary content, labels, placeholders

### Spacing & Layout

- Max content width: `1100px` (grid pages) or `780px` (detail/form pages)
- Container padding: `2rem` desktop, `1rem` mobile
- Standard gap between elements: `8px–1.25rem` depending on context

---

## Component Patterns

### Nav

```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15,15,15,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
}
.nav-brand {
  font-family: 'Lora', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
  letter-spacing: 0.02em;
}
.nav-btn {
  background: none;
  border: 1px solid var(--border2);
  color: var(--text2);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  transition: all 0.15s;
}
.nav-btn:hover { border-color: var(--accent); color: var(--accent); }
.nav-btn.active { background: var(--accent); color: #0f0f0f; border-color: var(--accent); font-weight: 500; }
```

### Page Switching (no URL routing)

```css
.page { display: none; }
.page.active { display: block; }
```

```js
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);
}
```

### Cards (Grid Layout)

```css
.card-grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.4rem;
  cursor: pointer;
  transition: all 0.18s;
}
.card:hover {
  border-color: var(--border2);
  background: var(--surface2);
  transform: translateY(-2px);
}
```

### Badges / Pills

```css
.badge {
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
/* Variants */
.badge-green  { background: rgba(74,140,92,0.18);  color: #6dbf8a; border: 1px solid rgba(74,140,92,0.3); }
.badge-gold   { background: rgba(200,169,110,0.14); color: var(--accent); border: 1px solid rgba(200,169,110,0.25); }
.badge-neutral{ background: var(--surface2); color: var(--text2); border: 1px solid var(--border2); }
.badge-red    { background: rgba(140,74,74,0.18);  color: #d08080; border: 1px solid rgba(140,74,74,0.3); }
```

### Buttons

```css
/* Primary (gold) */
.btn-primary {
  background: var(--accent);
  color: #0f0f0f;
  border: none;
  padding: 10px 22px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.btn-primary:hover { background: var(--accent2); color: #fff; }

/* Success (green) */
.btn-success {
  background: var(--green);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.btn-success:hover { opacity: 0.85; }

/* Danger (outline red on hover) */
.btn-danger {
  background: none;
  border: 1px solid var(--border2);
  color: var(--text3);
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}
.btn-danger:hover { border-color: var(--red); color: #d08080; }
```

### Form Inputs

```css
.form-input {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
}
.form-input:focus { border-color: var(--accent); }
.form-input::placeholder { color: var(--text3); }

.form-textarea {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}
.form-textarea:focus { border-color: var(--accent); }

.field-label {
  font-size: 11px;
  color: var(--text3);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 500;
}
```

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text);
  padding: 12px 18px;
  border-radius: var(--radius);
  font-size: 13px;
  z-index: 999;
  animation: slideup 0.2s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
@keyframes slideup {
  from { opacity:0; transform: translateY(8px); }
  to   { opacity:1; transform: translateY(0); }
}
```

```js
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.display = 'block';
  toastTimer = setTimeout(() => { t.style.display = 'none'; }, 2500);
}
```

### Loading Spinner

```css
.spinner {
  width: 16px; height: 16px;
  border: 2px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### Error Box

```css
.error-box {
  background: rgba(140,74,74,0.15);
  border: 1px solid rgba(140,74,74,0.35);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  color: #d08080;
  font-size: 13px;
  margin-bottom: 1rem;
}
```

### Print Stylesheet Pattern

```css
@media print {
  /* Hide everything except the main content area */
  nav, .no-print { display: none !important; }
  body { background: #fff !important; color: #000 !important; font-size: 11pt; font-family: Georgia, serif; }
  /* Reset dark theme colors on printed elements */
  .badge { background: none !important; color: #333 !important; border: 0.75pt solid #aaa !important; }
}
```

### Responsive Breakpoint

```css
@media (max-width: 640px) {
  nav { padding: 0 1rem; }
  .container { padding-left: 1rem; padding-right: 1rem; }
  .card-grid { padding: 1rem; grid-template-columns: 1fr; }
  .detail-page, .ai-page { padding: 1rem; }
}
```

---

## Firebase Patterns

### Firebase Init

```js
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
```

> Find these values in Firebase Console → Project Settings → Your apps → SDK setup and configuration.

### Admin Role Pattern

```js
// Hardcode your UID — find it by signing in and running firebase.auth().currentUser.uid in the console
const ADMIN_UID = 'YOUR_UID_HERE';

// In onAuthStateChanged:
isAdmin = user && user.uid === ADMIN_UID;
```

### Google Sign-In

```js
function signIn() {
  auth.signInWithPopup(googleProvider).catch(e => showToast('Sign-in failed: ' + e.message));
}

function signOut() {
  auth.signOut();
}
```

> ⚠️ Google sign-in popup does not work from `file://` URLs. Always test from the deployed HTTPS URL or a local server.

### Auth State + UI Update

```js
let currentUser = null;
let isAdmin = false;

auth.onAuthStateChanged(async user => {
  currentUser = user;
  isAdmin = user && user.uid === ADMIN_UID;
  updateAuthUI();
  // Load any user-specific data here (favorites, permissions, etc.)
});
```

### Firestore Real-Time Listener (with error fallback)

```js
// Always include an error callback — silent failures break the UI
db.collection('items').where('status', '==', 'published')
  .onSnapshot(snap => {
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render();
  }, err => {
    console.error('Firestore error:', err);
    // Fall back to local seed data so the page still works
    items = [...SEED_DATA];
    render();
  });
```

> ⚠️ Never use `.where().orderBy()` compound queries without creating a Firestore composite index — they fail silently. Instead, fetch with `.where()` only, then sort client-side.

### Seed Data Pattern (first-run)

```js
async function initData() {
  const snapshot = await db.collection('items').limit(1).get();
  if (snapshot.empty) {
    const batch = db.batch();
    SEED_DATA.forEach(item => {
      batch.set(db.collection('items').doc(item.id), item);
    });
    await batch.commit();
  }
  // Set up real-time listener after seeding
}
```

### Firestore CRUD

```js
async function saveItem(item) {
  await db.collection('items').doc(item.id).set(item);
}

async function updateItem(id, data) {
  await db.collection('items').doc(id).update(data);
}

async function deleteItem(id) {
  await db.collection('items').doc(id).delete();
}
```

### Firestore Security Rules Template

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /items/{itemId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null
                    && request.auth.uid == 'YOUR_ADMIN_UID';
    }

    // Per-user data (favorites, preferences, etc.)
    match /userdata/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Admin-grantable whitelist
    match /allowedEditors/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == 'YOUR_ADMIN_UID';
    }
  }
}
```

### Admin-Grantable Whitelist Pattern

```js
// State
let isAllowedEditor = false;

// Check on sign-in
async function checkAllowedEditor(uid) {
  try {
    const doc = await db.collection('allowedEditors').doc(uid).get();
    return doc.exists;
  } catch(e) { return false; }
}

// In onAuthStateChanged:
isAllowedEditor = isAdmin || await checkAllowedEditor(user.uid);

// To grant access: create a doc at allowedEditors/{uid} in Firebase console. No redeploy needed.
```

---

## Auth UI Component

```js
function updateAuthUI() {
  const area = document.getElementById('auth-area');

  if (!currentUser) {
    area.innerHTML = `<button class="auth-btn" onclick="signIn()">Sign in</button>`;
    return;
  }

  const photo = currentUser.photoURL
    ? `<img src="${currentUser.photoURL}" class="auth-avatar">`
    : `<div class="auth-avatar">${(currentUser.displayName||'U')[0]}</div>`;

  area.innerHTML = `
    <div style="position:relative;">
      <button class="auth-btn" onclick="toggleAuthMenu()">
        ${photo}
        ${currentUser.displayName?.split(' ')[0] || 'Account'}
        ${isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
      </button>
      <div class="auth-menu" id="auth-menu" style="display:none;">
        <div class="auth-menu-name">${currentUser.email}</div>
        <button class="auth-menu-item" onclick="signOut()">Sign out</button>
      </div>
    </div>`;
}

function toggleAuthMenu() {
  const menu = document.getElementById('auth-menu');
  if (!menu) return;
  authMenuOpen = !authMenuOpen;
  menu.style.display = authMenuOpen ? 'block' : 'none';
}

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('#auth-area')) {
    authMenuOpen = false;
    const menu = document.getElementById('auth-menu');
    if (menu) menu.style.display = 'none';
  }
});
```

---

## AI Chat Pattern (Anthropic API)

### API Key Onboarding

Store the user's API key in localStorage. Show an onboarding gate before the chat if no key is present.

```js
const API_KEY_STORE = 'anthropic_api_key';
function getApiKey() { return localStorage.getItem(API_KEY_STORE) || ''; }

function showAiPanel() {
  if (getApiKey()) {
    document.getElementById('ai-key-gate').style.display = 'none';
    document.getElementById('ai-chat-panel').style.display = 'block';
    if (!chatHistory.length) resetChat();
  } else {
    document.getElementById('ai-key-gate').style.display = 'block';
    document.getElementById('ai-chat-panel').style.display = 'none';
  }
}

function saveOnboardingKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key) return;
  localStorage.setItem(API_KEY_STORE, key);
  showToast('API key saved');
  showAiPanel();
}
```

**Onboarding HTML:**
```html
<div id="ai-key-gate" style="display:none">
  <div class="api-onboarding">
    <h2>Add your Anthropic API key</h2>
    <p>The AI feature uses Claude directly from your browser. You need your own API key.</p>
    <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">
      Get a key at console.anthropic.com →
    </a>
    <div style="display:flex;gap:8px;margin-top:1rem;">
      <input type="password" id="api-key-input" placeholder="sk-ant-..."
             onkeydown="if(event.key==='Enter')saveOnboardingKey()">
      <button onclick="saveOnboardingKey()">Save Key</button>
    </div>
    <p style="font-size:12px;color:var(--text3);margin-top:0.75rem;">
      Your key is stored only in your browser and sent directly to Anthropic.
      It is never stored on our servers.
    </p>
  </div>
</div>
```

### Conversational Chat

```js
let chatHistory = [];
let chatBusy = false;

const SYSTEM_PROMPT = `Your system prompt here.

Rules to always include:
- Define what topics are in scope and what should be declined
- Define the output format if structured data is expected (pure JSON, no markdown fences)
- State any behavior guardrails that cannot be overridden by the user`;

async function sendChat() {
  if (chatBusy) return;
  const key = getApiKey();
  if (!key) { showError('Please save your API key first.'); return; }
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = '';
  addChatMsg('user', text);
  chatHistory.push({ role: 'user', content: text });

  const thinking = addChatMsg('thinking', 'Thinking…');
  chatBusy = true;
  document.getElementById('chat-send').disabled = true;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: chatHistory
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const reply = data.content[0]?.text || '';
    thinking.remove();

    // If expecting JSON output, detect and handle it:
    if (reply.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(reply.trim());
        // Handle structured output...
        return;
      } catch(e) {}
    }

    chatHistory.push({ role: 'assistant', content: reply });
    addChatMsg('assistant', reply);

  } catch(e) {
    thinking.remove();
    showError('Error: ' + e.message);
  } finally {
    chatBusy = false;
    document.getElementById('chat-send').disabled = false;
    document.getElementById('chat-input').focus();
  }
}

function addChatMsg(role, text) {
  const el = document.createElement('div');
  el.className = 'chat-msg ' + role;
  el.textContent = text;
  const container = document.getElementById('chat-messages');
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

// Auto-growing textarea
function autoGrowInput(el) {
  el.style.height = '';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

// Submit on Enter, newline on Shift+Enter
function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}
```

**Chat CSS:**
```css
.chat-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}
.chat-messages {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.chat-msg { max-width: 82%; line-height: 1.55; font-size: 14px; }
.chat-msg.assistant {
  align-self: flex-start;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 4px 14px 14px 14px;
  padding: 10px 14px;
  color: var(--text);
  white-space: pre-wrap;
}
.chat-msg.user {
  align-self: flex-end;
  background: rgba(200,169,110,0.15);
  border: 1px solid rgba(200,169,110,0.25);
  border-radius: 14px 4px 14px 14px;
  padding: 10px 14px;
  color: var(--text);
}
.chat-msg.thinking {
  align-self: flex-start;
  color: var(--text3);
  font-style: italic;
  font-size: 13px;
}
.chat-input-row {
  border-top: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
}
.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text);
  padding: 12px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  resize: none;
  min-height: 44px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.5;
}
.chat-send-btn {
  background: var(--accent);
  color: #0f0f0f;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}
.chat-send-btn:hover:not(:disabled) { background: var(--accent2); color: #fff; }
.chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

**Chat HTML:**
```html
<textarea class="chat-input" id="chat-input"
  placeholder="Type here..."
  rows="1"
  onkeydown="chatKeydown(event)"
  oninput="autoGrowInput(this)"></textarea>
<button class="chat-send-btn" id="chat-send" onclick="sendChat()">Send</button>
```

### Injecting Context into System Prompt

To give Claude knowledge of existing data before each message:

```js
function buildSystemPrompt() {
  const items = data.filter(item => item.status === 'published');
  if (!items.length) return BASE_SYSTEM_PROMPT;

  const lines = items.map(item =>
    `- ${item.title}: ${item.description}`
  ).join('\n');

  return `Current items in the database:\n${lines}\n\n${BASE_SYSTEM_PROMPT}`;
}

// Use buildSystemPrompt() instead of BASE_SYSTEM_PROMPT in every API call
body: JSON.stringify({
  model: 'claude-sonnet-4-20250514',
  system: buildSystemPrompt(),  // ← dynamic each time
  messages: chatHistory
})
```

---

## Utility Functions

### HTML Escape

Always escape user-generated content before inserting into innerHTML:

```js
function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}
```

### Slug Generation

```js
function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
```

### Unique ID

```js
function makeId() {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}
```

---

## Deploy Workflow

### First Deploy

```bash
# Install Firebase CLI (Mac — requires sudo)
sudo npm install -g firebase-tools

# Login
firebase login

# Initialize (from project folder)
firebase init hosting

# Deploy
firebase deploy
```

### Ongoing Deploy

```bash
cd ~/Desktop/AI/ProjectName && firebase deploy
```

> ⚠️ Never open `index.html` in TextEdit on Mac — it silently converts the file to plain text and corrupts it. Always use VS Code or deploy directly without opening.

### Git Workflow

```bash
# Feature work
git checkout dev
# ... edit via Claude Code ...
git add . && git commit -m "feat: description" && git push origin dev

# Ship to production
git checkout main && git merge dev && git push origin main && firebase deploy

# Keep dev in sync
git checkout dev && git merge main && git push origin dev
```

---

## Common Gotchas

| Problem | Fix |
|--------|-----|
| Firestore `.where().orderBy()` fails silently | Remove `orderBy`, sort client-side instead |
| Firestore listener crashes without visible error | Always include error callback with seed data fallback |
| Google sign-in popup blocked | Must be served from `https://` — never `file://` |
| Firebase CLI permission error | Use `sudo npm install -g firebase-tools` |
| `(base)` in terminal prompt | Harmless Conda prefix — terminal works fine |
| Changes not showing after deploy | Hard refresh with `Cmd+Shift+R` |
| Firebase project creation blocked | Use plain Gmail — Google Workspace domains may be restricted |
| File corrupted after editing | Never open in TextEdit — use VS Code only |

---

## Checklist for a New App

- [ ] Create Firebase project (plain Gmail account)
- [ ] Enable Google Auth in Firebase console
- [ ] Create Firestore database
- [ ] Copy `index.html` boilerplate and update Firebase config
- [ ] Set `ADMIN_UID` (sign in, run `firebase.auth().currentUser.uid` in console)
- [ ] Write Firestore security rules and publish
- [ ] Create `firebase.json`
- [ ] Run `firebase init hosting` and `firebase deploy`
- [ ] Init git repo, connect to GitHub, create `main` and `dev` branches
- [ ] Test sign-in from deployed HTTPS URL (not file://)
- [ ] Test Firestore read/write
- [ ] Hard refresh to confirm no caching issues
