# SDLC Workflow Detector

## Purpose

This document provides AI with a systematic approach to detect and process SDLC phases from user prompts, ensuring proper workflow execution.

## Phase Detection Rules

### Phase Keywords

- `*flow` → AI Workflow Management Phase (not part of SDLC)
- `*req` → Requirements Phase
- `*design` → Design Phase
- `*code` → Implementation Phase
- `*test` → Testing Phase
- `*deploy` → Deployment Phase

### Detection Logic

1. **Exact Match**: Check if prompt starts with phase keyword
2. **Case Insensitive**: Convert to lowercase for matching
3. **Whitespace Handling**: Trim whitespace before detection
4. **Multiple Keywords**: Use first detected keyword

## Workflow Execution

### Phase 0: AI Workflow Management (`*flow`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/00-flow/ (existing workflow files)
2. Analyze user request for workflow changes
3. Create/update workflow files in ai/00-flow/ folder
4. Update workflow detection rules
5. Update AI implementation guides
```

### Phase 1: Requirements (`*req`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/01-requirements/ (existing requirements)
2. Extract requirement changes from user prompt
3. Follow Feature Requirements Content Guidelines:
   - MUST INCLUDE: Feature Overview, Functional Requirements, User Stories, Acceptance Criteria, Performance Requirements, Security Requirements, Traceability
   - MUST NOT INCLUDE: Data Structure, API Endpoints, Database Schema, Integration Details, Component Structure, Technical Interfaces
4. Update appropriate requirements document(s) in ai/01-requirements/ folder
5. Validate requirements completeness and content guidelines compliance
```

### Phase 2: Design (`*design`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/01-requirements/ (prerequisite)
2. Read ai/02-design/ (existing design documents)
3. Analyze requirements for design implications
4. Update design documents in ai/02-design/ folder
5. Ensure design traceability to requirements
```

### Phase 3: Implementation (`*code`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/01-requirements/ (prerequisite)
2. Read ai/02-design/features/ (prerequisite)
3. Review and update requirements/design if inconsistencies found
4. Read existing codebase structure
5. Create implementation documentation in ai/03-implementation/features/
6. Implement features according to specifications
7. Track implementation status (completed, in progress, pending, blocked)
8. Follow established patterns and conventions
```

### Phase 4: Testing (`*test`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/01-requirements/ (prerequisite)
2. Read ai/02-design/ (prerequisite)
3. Read ai/03-implementation/ (if exists)
4. Create test cases and test suites in ai/04-testing/ folder
5. Execute tests and report results
```

### Phase 5: Deployment (`*deploy`)

```typescript
// AI Behavior
0. Read ai/00-flow/ai-implementation-guide.md (detailed steps)
1. Read ai/01-requirements/ (prerequisite)
2. Read ai/02-design/ (prerequisite)
3. Read ai/03-implementation/ (if exists)
4. Read ai/04-testing/ (if exists)
5. Configure deployment settings in ai/05-deployment/ folder
6. Execute deployment process
7. Verify deployment success
```

## Document Reading Strategy

### Required Documents by Phase

- **AI Workflow Management**: `ai/00-flow/` (workflow system files)
- **Requirements**: `ai/01-requirements/` (overall, non-functional, and feature requirements)
- **Design**: `ai/01-requirements/` + `ai/02-design/`
- **Implementation**: `ai/01-requirements/` + `ai/02-design/` + existing codebase
- **Testing**: `ai/01-requirements/` + `ai/02-design/` + `ai/03-implementation/` + `ai/04-testing/`
- **Deployment**: All previous folders + `ai/05-deployment/`

### Reading Order

1. **AI Workflow Management** (for \*flow phase only)
2. **Requirements** (for requirements phase and beyond)
3. **Design** (for design phase and beyond)
4. **Implementation** (for implementation phase and beyond)
5. **Testing** (for testing phase and beyond)

## Error Handling

### Invalid Phase Detection

- If no phase keyword detected, ask user to specify phase
- If ambiguous phase, ask for clarification
- Default to requirements phase if unclear

### Missing Documents

- If required document doesn't exist, create it
- If document is incomplete, ask user for clarification
- Maintain document structure and format

### Inconsistent Requirements

- If requirements conflict, ask user to resolve
- If design doesn't match requirements, flag inconsistency
- If implementation doesn't match design, flag inconsistency

## Quality Checks

### Requirements Phase

- [ ] All functional requirements defined
- [ ] Non-functional requirements specified
- [ ] Constraints documented
- [ ] Acceptance criteria clear
- [ ] Stakeholder requirements included

### Design Phase

- [ ] Design traces to requirements
- [ ] UI/UX specifications complete
- [ ] Component design defined
- [ ] Data flow documented
- [ ] Responsive design specified

### Architecture Phase

- [ ] System architecture defined
- [ ] Component relationships clear
- [ ] Technology stack specified
- [ ] Integration patterns documented
- [ ] Performance considerations included

### Implementation Phase

- [ ] Code follows design specifications
- [ ] Established patterns used
- [ ] Error handling implemented
- [ ] TypeScript types defined
- [ ] Component structure consistent

### Testing Phase

- [ ] Test cases cover requirements
- [ ] Unit tests implemented
- [ ] Integration tests created
- [ ] Test coverage adequate
- [ ] Test results documented

### Deployment Phase

- [ ] Deployment configuration complete
- [ ] Environment variables set
- [ ] Build process working
- [ ] Deployment successful
- [ ] Post-deployment verification done

## Summary Generation

### Requirements Summary

- New requirements added
- Modified requirements
- Requirements validation status
- Next steps recommendation

### Design Summary

- Design changes made
- Component specifications
- UI/UX updates
- Design validation status
- Next steps recommendation

### Implementation Summary

- Features implemented
- Code structure
- Patterns used
- Error handling
- Next steps recommendation

### Testing Summary

- Test cases created
- Test results
- Coverage metrics
- Issues found
- Next steps recommendation

### Deployment Summary

- Deployment configuration
- Build status
- Deployment success
- Verification results
- Next steps recommendation

## Workflow Validation

### Phase Progression

- Ensure proper phase order
- Validate prerequisites are met
- Check document consistency
- Verify implementation matches design

### Document Consistency

- Requirements → Design traceability
- Design → Architecture traceability
- Architecture → Implementation traceability
- Implementation → Testing traceability
- Testing → Deployment traceability

### Quality Assurance

- Code quality standards
- Documentation completeness
- Test coverage adequacy
- Deployment readiness

---

_This workflow detector ensures systematic and consistent SDLC execution for the LNConnext project._
