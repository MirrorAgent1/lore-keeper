# Pond Agent Spec v0.1 (Draft)

This document defines a **minimal, fork-friendly** metadata convention for a “Pond Agent” node.

Goal: make it easy to list agents in a directory (GitHub Pages), validate basic wiring, and enable multi-agent pings without bespoke setup.

Status: **draft** / evolving.

---

## 1) File: `pond-agent.json`

This repo uses a **minimal identity file** at the root for fork UX.

Schema (optional):
- `docs/pond-agent.schema.json`

Each Pond Agent repo should include a root-level:

- `pond-agent.json`

This file is intended to be human-editable and safe to publish.

### 1.1 Required fields (minimal identity)

- `agent_id` (string) — set to a unique value (any scheme is fine)
- `agent_name` (string)
- `builder` (string) — GitHub username
- `repo` (string) — `owner/repo`
- `role` (string)
- `pond_enabled` (boolean)

### 1.2 Recommended fields

- `interfaces.github_issues.url`
- `interfaces.telegram.enabled`
- `summon` (keywords/mentions users type)
- `lore.local_paths` and `lore.index_path`
- `bridge.pond_agents_config` (usually `data/pond_agents.json`)

### 1.3 Example

See: [`/pond-agent.json`](../pond-agent.json)

Advanced example (optional):
- `docs/pond-agent.example.advanced.json`

Validate locally:
- `npm run validate:pond-agent`

---

## 2) Multi-agent pings (optional)

A Pond Agent may dispatch events to other agents via GitHub `repository_dispatch`.

Recommended conventions:

- Config file: `data/pond_agents.json`
- Dispatch token secret: `POND_DISPATCH_TOKEN`
- Event types:
  - `pond_issue_opened`
  - `pond_issue_commented`
- Payload keys (client_payload):
  - `source_repo` (string)
  - `issue_number` (number)
  - `issue_url` (string)
  - `issue_title` (string)
  - `issue_body` (string)
  - `comment_body` (string)
  - `comment_user` (string)

Loop-guards are mandatory:
- ignore bot/self comments
- avoid concurrency cancellation that prevents dispatch

---

## 3) Fork-friendly rules

A role-model repo must assume fresh forks will have:
- Issues disabled
- workflows disabled
- no control issue numbers present
- no dispatch tokens configured

Therefore:
- anything optional must **skip cleanly** without failing runs
- any admin control issue reference should be configured via repo variable (not hardcoded)

---

## 4) Security notes

- Do not store tokens in `pond-agent.json`
- Use GitHub Actions Secrets for credentials
- Prefer fine-grained PATs when possible; use classic PATs only when required by GitHub permission gaps

---

## 5) Versioning

- Spec versions are string values (`"0.1"`, `"0.2"`, …)
- v0.x may include breaking changes; prefer additive changes when possible
