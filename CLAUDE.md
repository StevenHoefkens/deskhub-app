# Intent Engineering SDLC Code Repo — Operator Notes

> Auto-loaded by Claude Code every session. **Generation guide: [docs/WORKFLOW.md](docs/WORKFLOW.md).**

This is a **code repository** in an Intent Engineering SDLC project. The specs that drive this code live upstream in the product-hub; code here is generated from them.

## Where things are
- **How generation works** → [docs/WORKFLOW.md](docs/WORKFLOW.md)
- **Generate code** → `/ie/generate` (detail: `.claude/commands/ie/generate.md`)
- **What to build this run** → `.flowforge/manifest.yml` (assembled + distributed by the hub, ADR-0041)
- **Where the product-hub lives** → `.ie/hub.yml` (per-machine pointer written by `ie feature handover`, read by `/ie/generate`; gitignored, never committed — ADR-0038/0054)
- **Foundation gates** → `ie service status <id>` from the product-hub (ADR-0043)

## Cardinal rules
- Generation is checkpoint-driven (CP1 → CP5); tests gate each step — don't skip checkpoints (ADR-0004 / ADR-0050).
- Fix defects in the upstream spec and regenerate; never hand-patch generated code (ADR-0002 / ADR-0017).

<!-- Project-specific rules go below. This file is yours — `ie service init` will not overwrite it. -->
