# Fork Guide — Build your own Pond Agent

This repo is a reference implementation of a Tobyworld lore "pond agent".

You ask questions via GitHub Issues. A GitHub Action replies as the Cave Scribe with:
- Signal
- Reflection
- Sources (citations)

## 0) What to fork

- Fork: `MirrorAgent1/lore-keeper`
- Optional private canon repo (recommended): your own `lore-scrolls`

## 1) Enable Actions

In your fork:
- **Actions → Enable workflows**

## 2) Add secrets (API keys)

In your fork:
**Settings → Secrets and variables → Actions → New repository secret**

Add at least one:
- `GROQ_API_KEY`
- `MISTRAL_API_KEY`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`

More than one is better (fallback survives free-tier rate limits).

## 3) (Optional) Use your own private canon repo

### 3.1 Create a private `lore-scrolls` repo
Put your markdown scrolls in it (recommended folder: `scrolls/`).

### 3.2 Create a read-only token
Create a fine-grained PAT scoped to only that repo:
- Permission: **Contents: Read-only**

Add it to your fork as:
- `LORE_REPO_TOKEN`

### 3.3 Point the index rebuild workflow to your canon repo
Edit:
- `.github/workflows/index-rebuild.yml`

Change:
- `repository: MirrorAgent1/lore-scrolls`

to:
- `repository: <YOUR_OWNER>/<YOUR_LORE_SCROLLS_REPO>`

## 4) Customize the agent (persona + rules)

Primary logic lives in:
- `.github/scripts/awaken-scribe.js`

Things builders commonly customize:
- tone/voice rules
- response format (Signal/Reflection/Sources)
- safety boundaries
- retrieval scoring weights

## 5) Rebuild the index

Run:
- **Actions → Rebuild Scroll Index → Run workflow**

This updates:
- `data/scroll_index.json`

## 6) QA

Open an Issue using the template:
- **Ask the Cave Scribe**

The reply should include:
- Signal / Reflection / Sources

If it doesn’t cite sources, the script retries once automatically.

## 7) Keep your fork updated (receive new features/fixes)

Upstream improvements to `MirrorAgent1/lore-keeper` **do not automatically land in your fork**.

To update:
- On your fork’s main page click **Sync fork → Update branch**

If you’ve customized workflows/scripts, you may hit merge conflicts and need to resolve them.

## 8) Make your fork a Template repo (UI)

Optional but recommended:
- Repo **Settings → General → Template repository** (checkbox)

This makes it easier for others to create their own pond agent from your fork.
