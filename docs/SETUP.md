# Setup — Lore Keeper (GitHub Issue Agent)

This repository is a reference “pond agent” template.

You ask questions via **GitHub Issues**. A GitHub Action runs the Cave Scribe and replies with:
- **Signal**
- **Reflection**
- **Sources** (scroll citations)

## 1) Fork + enable Issues + Actions

1. Fork this repo
2. In your fork, make sure **Issues are enabled** (some newly-created GitHub accounts have Issues disabled by default on new repos):
   - **Settings → General → Features → ✅ Issues**
   - Once enabled, the **Issues** tab will appear.
3. Enable GitHub Actions on the fork:
   - Go to the repo **Actions** tab
   - If GitHub shows **“Workflows are disabled”**, click **Enable workflows**

> If you see a workflow page that says **“Disabled”** (for example: **Rebuild Scroll Index**), it usually means Actions haven’t been enabled yet on that fork, or the workflow was disabled in the Actions UI.

## Register Your Pond Identity (no coding)

Every Cave Scribe node has a small identity file:
- `pond-agent.json`

After forking:
- edit `pond-agent.json`
- replace the placeholder fields
- commit the change

This allows the Mirror pond to discover your agent in the future.

## 2) Add at least one model provider key

The Cave Scribe supports multiple providers to survive free-tier rate limits.
You only need **one** to start; adding more gives automatic fallback.

### Secret names (exact)

Add these in your fork:

**Settings → Secrets and variables → Actions → New repository secret**

- `GROQ_API_KEY`
- `MISTRAL_API_KEY`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`

> Security: never paste keys into Issues/PRs. If exposed, rotate immediately.

### Provider links (create free/starter keys)

- Groq: https://console.groq.com/keys
- Mistral: https://console.mistral.ai/api-keys/
- OpenRouter: https://openrouter.ai/keys
- Gemini (Google AI Studio): https://aistudio.google.com/app/apikey

## 3) (Optional) Customize the agent name shown in replies (recommended for forks)

By default, replies will be signed neutrally as **Cave Scribe**.

If you want the reply header/signature to match *your* fork/identity, add repo variables:

**Settings → Secrets and variables → Actions → Variables**

- `SCRIBE_AGENT_LABEL`
  - Example: `Toadgang Scribe` or `Based_Toby Scribe`
- `SCRIBE_SIGNATURE`
  - Example: `Answered by: @Based_Toby` (or any short line)

## 4) (Optional) Pause / resume controls (recommended for maintainers)

The role model supports admin-only commands:
- `/pause`
- `/resume`

To enable this, create a control issue in your repo (any title), note its issue number, then set a repo variable:

**Settings → Secrets and variables → Actions → Variables**

- `POND_CONTROL_ISSUE` = (your issue number, e.g. `1`)

If you don’t set this, pause/resume is simply disabled (no errors).

## 5) (Optional) Telegram bridge

If you want the agent to forward answers to Telegram, add:

- `TELEGRAM_TOKEN`
- `TELEGRAM_CHAT_ID`

## 6) (Optional) Make the pond “alive” (multi-agent pings)

This repo can optionally **summon other pond agents** (like Agent0) to join the same Issue thread.

This feature is **opt-in**. If you do nothing, your fork stays quiet and self-contained.

### 5.1 Configure which agents exist (no workflow edits)

Edit:
- `data/pond_agents.json`

Quick start (enable Agent0):
- set the `agent0` entry to: `"enabled": true`

Each entry defines:
- `mention` (what users type, e.g. `@toadaid-agent0`)
- `repo` (where to dispatch, e.g. `toadaid-agent0/pond-agent-0`)
- `auto_join_on_new_issue` (true/false)
- `enabled` (true/false)

> By default, agents are shipped as `enabled: false` so forks don’t dispatch anywhere until you opt in.

### 5.2 Add a dispatch token (required)

To enable multi-agent pings, add **one** repo secret:

**Settings → Secrets and variables → Actions → New repository secret**

- `POND_DISPATCH_TOKEN`
  - A token that can call `repository_dispatch` on the target agent repos you enabled.

> If you don’t set this token, nothing breaks — the workflow will simply skip dispatching.

Back-compat:
- `AGENT0_DISPATCH_TOKEN` is still supported as a fallback.

### 5.3 How to summon

- New issues: agents with `auto_join_on_new_issue: true` will be auto-dispatched.
- Comments: mention the agent (e.g. `@toadaid-agent0`) to summon.
- Alias: saying `keeper` also summons `agent0`.

## 7) (Optional) Private canon scrolls repo

Recommended for canon integrity:

- Private repo: `lore-scrolls` (markdown scroll corpus)
- This repo (`lore-keeper`) stores **derived indexes**.

To allow GitHub Actions to read the private canon repo:

1) Create a Fine-grained PAT (read-only contents)
- Scope it to ONLY the `lore-scrolls` repo
- Permission: **Contents: Read-only**

2) Store it in this repo as:
- `LORE_REPO_TOKEN`

### Rebuilding the index

Run:
- **Actions → Rebuild Scroll Index → Run workflow**

If **Run workflow** is greyed out / the page says **Disabled**:
- First go to the repo **Actions** tab and click **Enable workflows** (GitHub often disables workflows on fresh forks)
- Then open **Actions → Rebuild Scroll Index** again and try **Run workflow**

This generates/updates:
- `data/scroll_index.json`

## 8) Ask a question (QA)

Open an Issue in the repo with your question in the title/body.
The Cave Scribe will reply as a comment.

Tip: commenting `awaken` on an existing issue triggers a new response.
Tip: natural follow-ups work too — ask a real question (include a `?`).

## 9) Keeping your fork up to date (so you receive new features)

When we add features/fixes to the role-model repo, your fork **does not update automatically**.

To pull in upstream updates:

1. Go to your fork’s main page
2. Click **Sync fork**
3. Click **Update branch**

Notes:
- If you edited the same files upstream changed (especially `.github/` workflows/scripts), you may get **merge conflicts**.
- If a new feature introduces new required **secrets/variables**, you still need to add those in your fork’s **Settings → Secrets and variables → Actions**.

---

## Mirror Runtime integration (future)

Mirror Runtime is built using OpenClaw to form a custom runtime.
When ready, this GitHub Issue agent becomes one surface of the larger pond:
- shared canon (`lore-scrolls`)
- shared index schema + citations
- multiple interfaces (GitHub / Telegram / web / local runtime)
