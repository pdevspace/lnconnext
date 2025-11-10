# LNConnext GitHub Copilot Commands

## Required Reading for GitHub Copilot

**CRITICAL**: Before executing any command, GitHub Copilot MUST read these files:

1. `ai/00-flow/workflow-detector.md` - Phase detection rules and workflow execution
2. `ai/00-flow/ai-implementation-guide.md` - Detailed implementation steps and patterns

## Copilot Command Execution Protocol

1. **Read Workflow Files**: Always read the required files first
2. **Detect Phase**: Use workflow detector to identify the correct phase
3. **Follow Steps**: Execute the detailed steps from implementation guide
4. **Validate**: Ensure all quality checks are met
5. **Document**: Update relevant documentation with traceability

## ⚠️ MANDATORY WORKFLOW COMPLIANCE FOR COPILOT

**EVERY command MUST follow this exact sequence:**

1. **ALWAYS** read `ai/00-flow/workflow-detector.md` first
2. **ALWAYS** read `ai/00-flow/ai-implementation-guide.md` second
3. **THEN** execute the specific phase steps as outlined in the implementation guide
4. **NEVER** skip the reading step - this ensures proper SDLC workflow execution
5. **ALWAYS** maintain traceability between phases

## GitHub Copilot Comment-Based Commands

### Workflow Management Commands

```typescript
// @copilot:flow [command] - Manage AI workflow system
// @copilot:flow update implementation guide
// @copilot:flow add new phase detection rule
// @copilot:flow fix workflow validation
```

### Requirements Phase Commands

```typescript
// @copilot:req [feature] [action] - Create and manage requirements
// @copilot:req user-auth add login requirements
// @copilot:req profiles validate requirements
```

### Design Phase Commands

```typescript
// @copilot:design [module] [action] - Create and manage design specifications
// @copilot:design profiles update UI design
// @copilot:design user-auth update component architecture
```

### Implementation Phase Commands

```typescript
// @copilot:code [feature] [action] - Implement features according to design
// @copilot:code profiles create CRUD operations
// @copilot:code user-auth add JWT authentication
```

### Testing Phase Commands

```typescript
// @copilot:test [feature] [action] - Create and execute test cases
// @copilot:test profiles create unit tests
// @copilot:test user-auth validate security tests
```

### Deployment Phase Commands

```typescript
// @copilot:deploy [environment] [action] - Configure and execute deployment
// @copilot:deploy production configure environment
// @copilot:deploy staging run deployment
// @copilot:deploy production verify deployment
```

## GitHub Copilot Inline Commands

### Code Generation Commands

```typescript
// @copilot:generate component UserProfile
// @copilot:generate api user-auth
// @copilot:generate hook useUser
// @copilot:generate test UserForm
// @copilot:generate type UserData
```

### Refactoring Commands

```typescript
// @copilot:refactor UserComponent to-hooks
// @copilot:refactor UserCard optimize
// @copilot:refactor UserAuth modernize
```

### Documentation Commands

```typescript
// @copilot:docs profiles update design spec
// @copilot:docs API create endpoint documentation
// @copilot:docs README update project overview
// @copilot:docs user-auth validate requirements
```

### Validation Commands

```typescript
// @copilot:validate requirements profiles
// @copilot:validate implementation user-auth
// @copilot:validate tests profiles
// @copilot:validate deployment production
```

### Database Commands

```typescript
// @copilot:db migrate add user tables
// @copilot:db seed add sample data
// @copilot:db validate schema consistency
// @copilot:db optimize user queries
// @copilot:db migrate add user tables
```

## Quality Assurance Commands

### Code Quality Commands

```typescript
// @copilot:quality code check TypeScript errors
// @copilot:quality design fix responsive issues
// @copilot:quality tests improve coverage
// @copilot:quality implementation validate patterns
// @copilot:quality code fix linting errors
```

### Performance Commands

```typescript
// @copilot:performance frontend optimize loading
// @copilot:performance api improve response times
// @copilot:performance database optimize queries
// @copilot:performance user optimize rendering
```

## GitHub Copilot Usage Instructions

### Basic Usage

1. **Add comment before code**: Use `// @copilot:` followed by command
2. **Specify phase and action**: Include the feature/module and action
3. **Let Copilot generate**: Copilot will read workflow files and generate code
4. **Validate output**: Check that generated code follows patterns

### Advanced Usage

1. **Chain commands**: Use multiple `@copilot:` comments in sequence
2. **Combine phases**: Mix different phase commands in same file
3. **Use validation**: Always include validation commands after generation
4. **Follow patterns**: Ensure generated code matches project patterns

### Examples

#### Complete Feature Development

```typescript
// @copilot:requirement user-auth add login requirements
// @copilot:design user-auth create login UI design
// @copilot:implement user-auth create login API
// @copilot:test user-auth create login tests
// @copilot:validate implementation user-auth
```

#### Code Generation with Validation

```typescript
// @copilot:generate component UserLogin
// @copilot:generate api user-auth
// @copilot:generate test UserLogin
// @copilot:validate requirements user-auth
// @copilot:validate implementation user-auth
```

#### Refactoring with Quality Check

```typescript
// @copilot:refactor UserComponent to-hooks
// @copilot:quality code check TypeScript errors
// @copilot:validate implementation user-auth
```

## Copilot-Specific Tips

### Comment Placement

- Place `@copilot:` comments **above** the code you want to generate
- Use **single line comments** for simple commands
- Use **multi-line comments** for complex instructions

### Command Structure

- **Always include phase**: `@copilot:requirement`, `@copilot:design`, etc.
- **Be specific about feature**: Include the module/feature name
- **Specify action**: What you want to accomplish

### Workflow Integration

- **Read workflow files first**: Copilot will automatically read required files
- **Follow SDLC phases**: Use proper phase progression
- **Maintain traceability**: Ensure documentation links are updated
- **Validate quality**: Always include validation commands

### Best Practices

1. **Start with requirements**: Always begin with `@copilot:requirement`
2. **Follow phase order**: Requirements → Design → Implementation → Testing → Deployment
3. **Use validation**: Include `@copilot:validate` commands frequently
4. **Be specific**: Include detailed feature and action descriptions
5. **Check patterns**: Ensure generated code follows project patterns

## Integration with SDLC Workflow

### Automatic Workflow Reading

When you use any `@copilot:` command, GitHub Copilot will:

1. **Read** `ai/00-flow/workflow-detector.md` automatically
2. **Read** `ai/00-flow/ai-implementation-guide.md` automatically
3. **Detect** the correct phase from your command
4. **Follow** the specific steps for that phase
5. **Generate** code according to the implementation guide
6. **Validate** the output against quality standards

### Phase-Specific Behavior

- **Requirements**: Generates documentation in `ai/01-requirements/`
- **Design**: Creates specifications in `ai/02-design/`
- **Implementation**: Generates code following project patterns
- **Testing**: Creates test files in `ai/04-testing/`
- **Deployment**: Configures deployment in `ai/05-deployment/`

This ensures GitHub Copilot follows the same structured SDLC workflow as Cursor, maintaining consistency across different AI tools.
