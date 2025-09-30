# LNConnext AI Commands

## Required Reading
**CRITICAL**: Before executing any command, Cursor MUST read these files:
1. `ai/00-flow/workflow-detector.md` - Phase detection rules and workflow execution
2. `ai/00-flow/ai-implementation-guide.md` - Detailed implementation steps and patterns

## Command Execution Protocol
1. **Read Workflow Files**: Always read the required files first
2. **Detect Phase**: Use workflow detector to identify the correct phase
3. **Follow Steps**: Execute the detailed steps from implementation guide
4. **Validate**: Ensure all quality checks are met
5. **Document**: Update relevant documentation with traceability

## ⚠️ MANDATORY WORKFLOW COMPLIANCE
**EVERY command MUST follow this exact sequence:**
1. **ALWAYS** read `ai/00-flow/workflow-detector.md` first
2. **ALWAYS** read `ai/00-flow/ai-implementation-guide.md` second
3. **THEN** execute the specific phase steps as outlined in the implementation guide
4. **NEVER** skip the reading step - this ensures proper SDLC workflow execution
5. **ALWAYS** maintain traceability between phases

## SDLC Phase Commands

### Workflow Management
```
*flow [command]
```
**Purpose**: Manage AI workflow system and implementation guides
**Required Steps**:
1. Read `ai/00-flow/workflow-detector.md`
2. Read `ai/00-flow/ai-implementation-guide.md`
3. Analyze workflow changes needed
4. Update workflow files in `ai/00-flow/` folder
5. Validate workflow consistency
**Examples**:
- `*flow update implementation guide`
- `*flow add new phase detection rule`
- `*flow fix workflow validation`

### Requirements Phase
```
*req [feature] [action]
```
**Purpose**: Create and manage requirements documentation
**Required Steps**:
1. Read `ai/00-flow/ai-implementation-guide.md` (detailed steps)
2. Read `ai/01-requirements/` (existing requirements)
3. Extract requirement changes from user prompt
4. Follow Feature Requirements Content Guidelines:
   - MUST INCLUDE: Feature Overview, Functional Requirements, User Stories, Acceptance Criteria, Performance Requirements, Security Requirements, Traceability
   - MUST NOT INCLUDE: Data Structure, API Endpoints, Database Schema, Integration Details, Component Structure, Technical Interfaces
5. Update appropriate requirements document(s) in `ai/01-requirements/` folder
6. Validate requirements completeness and content guidelines compliance
**Examples**:
- `*req user-auth add login requirements`
- `*req event-management update booking requirements`
- `*req bitcoiner-profiles validate requirements`

### Design Phase
```
*design [module] [action]
```
**Purpose**: Create and manage design specifications
**Required Steps**:
1. Read `ai/00-flow/ai-implementation-guide.md` (detailed steps)
2. Read `ai/01-requirements/` (prerequisite)
3. Read `ai/02-design/` (existing design documents)
4. Analyze requirements for design implications
5. Update design documents in `ai/02-design/` folder
6. Ensure design traceability to requirements
**Examples**:
- `*design bitcoiner-profiles update UI design`
- `*design event-management create API design`
- `*design user-auth update component architecture`

### Implementation Phase
```
*code [feature] [action]
```
**Purpose**: Implement features according to design specifications
**Required Steps**:
1. Read `ai/00-flow/ai-implementation-guide.md` (detailed steps)
2. Read `ai/01-requirements/` (prerequisite)
3. Read `ai/02-design/` (prerequisite)
4. Read existing codebase structure
5. Implement features according to specifications in `ai/03-implementation/` folder
6. Follow established patterns and conventions
**Examples**:
- `*code bitcoiner-profiles create CRUD operations`
- `*code event-management add calendar integration`
- `*code user-auth add JWT authentication`

### Testing Phase
```
*test [feature] [action]
```
**Purpose**: Create and execute test cases
**Required Steps**:
1. Read `ai/00-flow/ai-implementation-guide.md` (detailed steps)
2. Read `ai/01-requirements/` (prerequisite)
3. Read `ai/02-design/` (prerequisite)
4. Read `ai/03-implementation/` (if exists)
5. Create test cases and test suites in `ai/04-testing/` folder
6. Execute tests and report results
**Examples**:
- `*test bitcoiner-profiles create unit tests`
- `*test event-management run integration tests`
- `*test user-auth validate security tests`

### Deployment Phase
```
*deploy [environment] [action]
```
**Purpose**: Configure and execute deployment
**Required Steps**:
1. Read `ai/00-flow/ai-implementation-guide.md` (detailed steps)
2. Read `ai/01-requirements/` (prerequisite)
3. Read `ai/02-design/` (prerequisite)
4. Read `ai/03-implementation/` (if exists)
5. Read `ai/04-testing/` (if exists)
6. Configure deployment settings in `ai/05-deployment/` folder
7. Execute deployment process
8. Verify deployment success
**Examples**:
- `*deploy production configure environment`
- `*deploy staging run deployment`
- `*deploy production verify deployment`

## Quick Commands

### Code Generation
```
generate [type] [name]
```
**Types**: `component`, `api`, `service`, `hook`, `test`, `type`
**Examples**:
- `generate component UserProfile`
- `generate api user-auth`
- `generate service EventService`
- `generate hook useUser`
- `generate test BitcoinerForm`
- `generate type UserData`

### Refactoring
```
refactor [target] [action]
```
**Actions**: `to-hooks`, `to-typescript`, `optimize`, `modernize`
**Examples**:
- `refactor UserComponent to-hooks`
- `refactor EventService to-typescript`
- `refactor BitcoinerCard optimize`

### Documentation
```
docs [target] [action]
```
**Actions**: `update`, `create`, `validate`, `format`
**Examples**:
- `docs bitcoiner-profiles update design spec`
- `docs API create endpoint documentation`
- `docs README update project overview`

### Validation
```
validate [target]
```
**Targets**: `requirements`, `design`, `implementation`, `tests`, `deployment`
**Examples**:
- `validate requirements bitcoiner-profiles`
- `validate design event-management`
- `validate implementation user-auth`

## Project-Specific Commands

### Bitcoiner Module
```
bitcoiner [action]
```
**Actions**: `create`, `update`, `delete`, `list`, `validate`
**Examples**:
- `bitcoiner create new profile form`
- `bitcoiner update social media validation`
- `bitcoiner validate API endpoints`

### Event Module
```
event [action]
```
**Actions**: `create`, `update`, `delete`, `list`, `calendar`
**Examples**:
- `event create calendar integration`
- `event update booking system`
- `event validate date handling`

### User Module
```
user [action]
```
**Actions**: `auth`, `profile`, `permissions`, `validation`
**Examples**:
- `user auth implement JWT`
- `user profile create settings page`
- `user permissions add role-based access`

## Architecture Commands

### API Design
```
api [module] [action]
```
**Actions**: `create`, `update`, `validate`, `test`
**Examples**:
- `api bitcoiner create CRUD endpoints`
- `api event update calendar endpoints`
- `api user validate authentication`

### Database
```
db [action]
```
**Actions**: `migrate`, `seed`, `validate`, `optimize`
**Examples**:
- `db migrate add bitcoiner tables`
- `db seed add sample data`
- `db validate schema consistency`

### Frontend
```
frontend [component] [action]
```
**Actions**: `create`, `update`, `style`, `optimize`
**Examples**:
- `frontend BitcoinerCard update styling`
- `frontend EventCalendar create component`
- `frontend UserProfile optimize performance`

## Quality Assurance Commands

### Code Quality
```
quality [target] [action]
```
**Actions**: `check`, `fix`, `improve`, `standardize`
**Examples**:
- `quality code check TypeScript errors`
- `quality design fix responsive issues`
- `quality tests improve coverage`

### Performance
```
performance [target] [action]
```
**Actions**: `analyze`, `optimize`, `monitor`, `improve`
**Examples**:
- `performance frontend optimize loading`
- `performance api improve response times`
- `performance database optimize queries`

## Usage Instructions

### Basic Usage
1. Start your prompt with a phase keyword (`*flow`, `*req`, etc.)
2. Specify the target feature or module
3. Describe the action you want to perform
4. The AI will follow the appropriate SDLC workflow

### Advanced Usage
1. Combine multiple commands: `*code bitcoiner-profiles create CRUD and generate tests`
2. Use validation commands to check work: `validate implementation bitcoiner-profiles`
3. Chain phases: `*req user-auth add requirements` then `*design user-auth create design`

### Examples
```
*req event-management add booking system requirements
*design event-management create booking UI design
*code event-management create booking API
*test event-management create booking tests
*deploy production deploy booking system
```

### Tips
- Be specific about the feature/module you're working on
- Use the validation commands to ensure quality
- Chain phases for complete feature development
- Use quick commands for rapid prototyping
- Always validate before moving to next phase
