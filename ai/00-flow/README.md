# SDLC Workflow System

This folder contains all the Software Development Life Cycle (SDLC) workflow system files for the LNConnext project.

## Files

- **`workflow-detector.md`** - AI workflow detection rules and processing steps
- **`ai-implementation-guide.md`** - Step-by-step guide for AI assistants
- **`templates/`** - Template files for each SDLC phase

## Usage

When you start a prompt with any of these keywords, the AI will follow the workflow:

- `*flow` - **AI Workflow Management** (create/edit files in ai/00-flow/) - NOT part of SDLC
- `*requirement` - Requirements phase (SDLC Phase 1)
- `*design` - Design phase (SDLC Phase 2)
- `*implement` - Implementation phase (SDLC Phase 3)
- `*test` - Testing phase (SDLC Phase 4)
- `*deploy` - Deployment phase (SDLC Phase 5)

**Note**: `*flow` is special - it manages the AI workflow system itself by creating/editing files in `ai/00-flow/` that tell the AI what to do for other phases. It's not part of the Software Development Life Cycle (SDLC).

## Folder Organization

All phases are organized in numbered folders:
- `ai/00-flow/` - AI Workflow Management (workflow system files)
- `ai/01-requirements/` - Requirements documents (SDLC Phase 1)
- `ai/02-design/` - Design documents (SDLC Phase 2)
- `ai/03-implementation/` - Implementation documents (SDLC Phase 3)
- `ai/04-testing/` - Testing documents (SDLC Phase 4)
- `ai/05-deployment/` - Deployment documents (SDLC Phase 5)

---

*This workflow system ensures systematic, documented, and traceable development processes.*
