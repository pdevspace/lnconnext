# AI Implementation Guide for SDLC Workflow

## Overview

This guide provides AI assistants with a systematic approach to follow the Software Development Life Cycle (SDLC) workflow when processing user requests in the LNConnext project.

## AI Workflow Management Phase (`*flow`)

#### Purpose

The `*flow` phase is for creating and editing files in `ai/00-flow/` to manage and improve the AI workflow system. This phase is NOT part of the Software Development Life Cycle (SDLC) but rather enhances how the AI processes requests within each SDLC phase.

#### Main Objective

**Create or edit files in `ai/00-flow/`** - AI Workflow Management (workflow system files)

#### Project Technology Stack

- **Package Manager**: Use `yarn` (not npm) for all package management operations
- **Node.js**: Latest LTS version
- **Framework**: Next.js with App Router
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components

#### Traceability Requirements

All SDLC phases must maintain traceability relationships:

**Requirements Phase (ai/01-requirements/)**:

- Overall requirements files may not have specific relations
- Feature-specific requirements must document which design files they influence
- Each feature requirement must specify which implementation files it drives

**Design Phase (ai/02-design/)**:

- Each design file must document:
  - **Source Requirements**: Which requirement file(s) this design addresses
  - **Target Implementation**: Which implementation file(s) this design will be used for
- Overall design files may not have specific relations
- Module-specific design files must have clear traceability

**Implementation Phase (ai/03-implementation/)**:

- Each implementation file must document:
  - **Source Design**: Which design file(s) this implementation follows
  - **Source Requirements**: Which requirement file(s) this implementation addresses
  - **Target Testing**: Which test file(s) will test this implementation

**Testing Phase (ai/04-testing/)**:

- Each test file must document:
  - **Source Implementation**: Which implementation file(s) this test covers
  - **Source Design**: Which design file(s) this test validates
  - **Source Requirements**: Which requirement file(s) this test verifies

#### File Objectives in ai/00-flow/

**`workflow-detector.md`**

- **Objective**: Main workflow specification and detection rules
- **Purpose**: Defines how AI detects SDLC phases from user prompts and provides high-level processing steps
- **Contains**: Phase keywords, detection logic, document reading strategy, error handling

**`ai-implementation-guide.md`**

- **Objective**: Detailed working instructions for each SDLC phase
- **Purpose**: Provides step-by-step instructions for AI to follow during each phase
- **Contains**: Detailed processing steps, quality assurance, best practices

**`README.md`**

- **Objective**: Overview and usage guide for the AI workflow system
- **Purpose**: Explains how to use the workflow system and what each phase does
- **Contains**: Phase descriptions, folder organization, usage examples

**`templates/` folder**

- **Objective**: Template files for consistent documentation
- **Purpose**: Provides standardized templates for creating new documents
- **Contains**: Templates for requirements, design, implementation, testing, deployment

## Requirements Phase (`*req`)

#### Purpose

The Requirements Phase is the first phase of the Software Development Life Cycle (SDLC) that focuses on gathering, analyzing, and documenting what the system should do. It establishes the foundation for all subsequent phases by clearly defining user needs, system capabilities, and constraints.

#### Main Objective

**Create or edit files in `ai/01-requirements/`** - Requirements documents (SDLC Phase 1)

#### Objective

To create comprehensive, clear, and traceable requirements documentation that serves as the single source of truth for system development, ensuring all stakeholders understand what needs to be built and why.

#### Details

The Requirements Phase involves three main types of requirements:

- **Overall Requirements**: High-level business and user requirements
- **Non-Functional Requirements**: Technical constraints and quality attributes
- **Feature Requirements**: Specific functional specifications for individual features

#### Traceability Requirements

Each requirements file must include traceability information:

**Overall Requirements** (`overall-requirements.md`):

- **Traceability**: No specific relations required (overall scope)
- **Purpose**: Foundation for all other requirements

**Non-Functional Requirements** (`non-functional-requirements.md`):

- **Traceability**: No specific relations required (system-wide constraints)
- **Purpose**: Technical foundation for all implementations

**Feature Requirements** (`features/[feature-name].md`):

- **Traceability**: Must document:
  - **Target Design Files**: Which design files this requirement will influence
  - **Target Implementation Files**: Which implementation files this requirement will drive
  - **Target Test Files**: Which test files will verify this requirement
- **Purpose**: Specific functional specifications for individual features

#### Folder Structure: ai/01-requirements/

**`overall-requirements.md`**

- **Purpose**: Document high-level business and user requirements
- **Objective**: Establish project scope, user characteristics, marketing goals, and business objectives
- **Contains**: Project scope, user personas, business goals, success criteria, stakeholder requirements

**`non-functional-requirements.md`**

- **Purpose**: Define technical constraints and quality attributes
- **Objective**: Specify performance, security, scalability, and technical requirements
- **Contains**: Hardware requirements, software requirements, tech stack, performance criteria, security requirements, scalability needs

**`features/` folder**

- **Purpose**: Store individual feature specifications
- **Objective**: Provide detailed functional requirements for each system feature
- **Contains**: One file per feature/module with specific requirements

#### Feature Requirements Content Guidelines

**MUST INCLUDE**:

- **Feature Overview**: What the feature does
- **Functional Requirements**: Specific functionality and capabilities
- **User Stories**: How users interact with the feature
- **Acceptance Criteria**: How to verify the feature works
- **Performance Requirements**: Speed and performance expectations
- **Security Requirements**: Security needs (where applicable)
- **Traceability**: Links to design, implementation, and test files

**MUST NOT INCLUDE** (Technical implementation details belong in Design Phase):

- ❌ **Data Structure**: TypeScript interfaces, data models
- ❌ **API Endpoints**: REST API specifications, endpoint definitions
- ❌ **Database Schema**: Prisma models, database structures
- ❌ **Integration Details**: Third-party service configurations
- ❌ **Component Structure**: React component specifications
- ❌ **Technical Interfaces**: Service interfaces, configuration objects

**Rationale**: Requirements focus on WHAT the system should do, not HOW it should be implemented. Technical implementation details are handled in the Design Phase (`*design`).

## Design Phase (`*design`)

#### Purpose

The Design Phase is the second phase of the Software Development Life Cycle (SDLC) that focuses on creating detailed technical specifications and visual designs based on the requirements. It translates user needs into concrete system architecture, user interfaces, and technical solutions.

#### Main Objective

**Create or edit files in `ai/02-design/`** - Design documents (SDLC Phase 2)

#### Objective

To create comprehensive design documentation that serves as a blueprint for implementation, ensuring the system meets all requirements while being maintainable, scalable, and user-friendly.

#### Details

The Design Phase involves four main areas:

- **UI/UX Design**: User interface and user experience specifications
- **Component Architecture**: System component structure and relationships
- **Data Flow**: Data management and flow patterns
- **API Design**: Application programming interface specifications

#### Traceability Requirements

Each design file must include traceability information:

**Overall Design Files** (e.g., `frontend-overall.md`, `backend-overall.md`):

- **Traceability**: No specific relations required (overall architecture)
- **Purpose**: Foundation for all other design files

**Module-Specific Design Files** (e.g., `frontend-pages/user-profile.md`, `backend-modules/user-module.md`):

- **Traceability**: Must document:
  - **Source Requirements**: Which requirement file(s) this design addresses
  - **Target Implementation**: Which implementation file(s) this design will be used for
  - **Target Testing**: Which test file(s) will validate this design
- **Purpose**: Specific design specifications for individual modules

#### Folder Structure: ai/02-design/

**Frontend Design Files:**

**`frontend-overall.md`**

- **Purpose**: Define overall frontend architecture and patterns
- **Objective**: Establish frontend structure, technology stack, and global patterns
- **Contains**: Technology stack, folder structure, global patterns, state management, routing strategy

**`frontend-global-components.md`**

- **Purpose**: Define global public components used across multiple pages
- **Objective**: Create reusable component specifications for common UI elements
- **Contains**: Navbar, Footer, Layout, Modal, Button, Input, Card, Loading, Error components

**`frontend-pages/` folder**

- **Purpose**: Store page-specific design specifications
- **Objective**: Provide detailed design for each page/module matching requirements features
- **Contains**: One file per page/module (e.g., `home-page.md`)

#### Data Flow Architecture

**Complete Data Flow**: Database → Backend → Frontend

**Backend Data Flow**:

1. **Database** → **Model** → **Service** → **Handler** → **API Endpoint**

**Frontend Data Flow**: 2. **API Endpoint** → **Frontend Service** → **Page Component** → **UI**

#### Backend Data Flow

**1. Model Layer** (`src/models/`)

- **Purpose**: Define data interfaces and validation schemas
- **Contains**: `user.ts`
- **Role**: TypeScript interfaces and validation schemas

**2. Service Layer** (`src/services/`)

- **Purpose**: Business logic and database operations
- **Contains**: `UserService.ts`, `EventService.ts`
- **Role**: CRUD operations, business rules, data transformation

**3. Handler Layer** (`src/app/api/[module]/[action]/`)

- **Purpose**: HTTP request/response handling
- **Contains**: `route.ts` files
- **Role**: Request validation, error handling, response formatting

#### Frontend Data Flow

**1. API Endpoint** (`src/app/api/`)

- **Purpose**: API endpoints
- **Contains**: `user/create/route.ts`, `user/profile.get/route.ts`
- **Role**: Handle HTTP requests, call services, return responses

**2. Frontend Types** (`src/types/`)

- **Purpose**: Frontend-specific TypeScript interfaces
- **Contains**: `user.ts`, `event.ts`, `common.ts`
- **Role**: Define frontend data structures and UI types

**3. Frontend Service** (`src/hooks/`)

- **Purpose**: React hooks for API communication
- **Contains**: `useEvent.ts`, `useUser.ts`
- **Role**: State management, API calls, loading states, error handling

**4. Frontend Utils** (`src/utils/`)

- **Purpose**: Frontend utility functions and helpers
- **Contains**: `dateUtils.ts`, `formatters.ts`, `frontendValidators.ts`, `backendValidators.ts`
- **Role**: Date formatting, data transformation, validation helpers

**5. Page Component** (`src/components/pages/`)

- **Purpose**: Main page logic and UI
- **Contains**: `HomePage.tsx`, `UserDetailPage.tsx`
- **Role**: Use frontend services, render UI, handle user interactions

#### Global CSS Requirements

**Critical CSS Configuration**:

- **Global overflow**: `body { overflow: hidden; }` - Prevents page-level scrolling
- **Page-level scrolling**: Use `h-screen overflow-y-auto` on scrollable containers
- **Scrollbar utilities**: Include `.scrollbar-hide` utility for clean horizontal scrolling

**Implementation**:

```css
/* src/app/globals.css */
@layer base {
	body {
		@apply bg-background text-foreground;
		overflow: hidden; /* REQUIRED: Prevents page-level scrolling */
	}
}

@layer utilities {
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
}
```

**Page Component Scrolling Pattern**:

```tsx
// For scrollable pages, use this pattern:
<div className="h-screen overflow-y-auto">{/* Page content */}</div>
```

#### Suggested Folder Structure

**Backend Folders**:

```
src/
├── models/
│   ├── user.ts               # Data interfaces
│   ├── event.ts              # Data interfaces
│   └── validation/
│       ├── user.ts           # Validation schemas
│       └── event.ts          # Validation schemas
├── services/
│   ├── UserService.ts        # Service layer
│   └── EventService.ts       # Service layer
└── app/api/
    ├── user/
    │   ├── create/route.ts   # Handler layer
    │   ├── get/route.ts      # Handler layer
    │   ├── update/route.ts   # Handler layer
    │   └── delete/route.ts   # Handler layer
    └── event/
        ├── create/route.ts
        └── list/route.ts
```

**Frontend Folders**:

```
src/
├── type/
│   ├── user.ts               # Frontend interfaces
│   ├── event.ts              # Frontend interfaces
│   └── common.ts             # Common types
├── hooks/
│   ├── useUser.ts            # Frontend service
│   └── useEvent.ts           # Frontend service
├── utils/
│   ├── dateUtils.ts          # Date formatting
│   ├── formatters.ts         # Data formatters
│   └── validators.ts         # Validation helpers
├── components/pages/
│   ├── home/
│   │   ├── HomePage.tsx      # Page component
│   │   └── HomeComponent.tsx # Sub-component
│   ├── user/
│   │   ├── UserListPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── UserCard.tsx
│   └── event/
│       ├── EventListPage.tsx
│       ├── EventDetailPage.tsx
│       └── EventCard.tsx
└── app/
    ├── page.tsx              # App router page
    ├── user/
    │   └── [id]/page.tsx     # App router page
    └── event/
        └── [eventId]/page.tsx # App router page
```

#### Next.js App Router Structure

**Page Structure Pattern**:

- **App Router Pages**: `src/app/[route]/page.tsx` - Only return page component
- **Page Component**: `src/components/pages/[feature]/[FeatureName]Page.tsx` - Contains main logic
- **Sub-components**: `src/components/pages/[feature]/[FeatureName]Component.tsx` - Reusable components

**Example App Router Pages Implementation**:

```typescript
// src/app/page.tsx
import HomePage from '@/components/pages/home/HomePage';
export default function Page() {
  return <HomePage />;
}

// src/app/event/page.tsx
import EventListPage from '@/components/pages/event/EventListPage';
export default function Page() {
  return <EventListPage />;
}

// src/app/event/[eventId]/page.tsx
import EventDetailPage from '@/components/pages/event/EventDetailPage';
interface PageProps {
  params: { eventId: string };
}
export async function generateStaticParams() {
   ...
}
export default function Page({ params }: PageProps) {
  return <EventDetailPage eventId={params.eventId} />;
}
```

**Backend Design Files:**

**`backend-overall.md`**

- **Purpose**: Define overall backend architecture and patterns
- **Objective**: Establish backend structure, technology stack, and global patterns
- **Contains**: Technology stack, folder structure, global patterns, database design, security patterns

**`backend-core-logic.md`**

- **Purpose**: Define core business logic and shared services
- **Objective**: Create specifications for core functionality used across modules
- **Contains**: Authentication service, data validation, error handling, logging, caching

**`backend-modules/` folder**

- **Purpose**: Store module-specific backend design specifications
- **Objective**: Provide detailed design for each backend module matching requirements features
- **Contains**: One file per module (e.g., `user-module.md`, `event-module.md`)

**Other Design Files:**

**`database-design.md`**

- **Purpose**: Define database schema and data relationships
- **Objective**: Create comprehensive database design for data persistence
- **Contains**: Entity diagrams, table schemas, relationships, indexes, constraints

**`api-design.md`**

- **Purpose**: Define API specifications and contracts
- **Objective**: Create clear API contracts for frontend-backend communication
- **Contains**: API endpoints, request/response schemas, authentication patterns, error handling

#### 3-Layer API Architecture

The project uses a 3-layer API architecture pattern:

**1. Endpoint Layer** (`src/app/api/[module]/[section].[action]/route.ts`)

- **Purpose**: Handle HTTP requests and responses
- **Objective**: Validate input, call handlers, format responses
- **Example**: `src/app/api/user/profile.get/route.ts`
- **Contains**: Request validation, error handling, response formatting

**2. Handler Layer**

- **Purpose**: Business logic and data processing
- **Objective**: Implement core business rules and data operations
- **Contains**: Database operations, business logic, data transformation

**3. Service Layer**

- **Purpose**: Frontend data management and API communication
- **Objective**: Provide React hooks for component data management
- **Contains**: State management, API calls, loading states, error handling

#### API Endpoint Format

**All endpoints use POST method with pattern**: `/[module]/[section].[action]`

**Critical API Format Rules**:

- **All endpoints MUST use POST method** (no GET, PUT, DELETE)
- **No dynamic routes with [id]** - use POST with payload instead
- **Pattern**: `/[module]/[section].[action]` where:
  - `module`: Feature module (auth, user, store, event, etc.)
  - `section`: Optional section (profile, list, etc.)
  - `action`: Specific action (get, list, create, update, delete, etc.)

**Correct Examples**:

- `POST /api/store/get` with payload `{id: "store123"}`
- `POST /api/user/profile.get` with payload `{id: "user456"}`
- `POST /api/event/list` with payload `{filters: {...}}`

**Incorrect Examples** (DO NOT USE):

- `GET /api/store/[id]` ❌
- `GET /api/user/profile` ❌
- `PUT /api/event/update` ❌

**Action Examples**:

- `get` - Retrieve single item
- `list` - Retrieve multiple items
- `create` - Create new item
- `update` - Update existing item
- `delete` - Delete item
- `follow` - Follow/unfollow action
- `download` - Download content
- `login` - User login
- `logout` - User logout

**Endpoint Examples**:

- `/auth/login` - User authentication
- `/auth/logout` - User logout
- `/user/list` - List all users
- `/user/profile.get` - Get user profile
- `/user/profile.delete` - Delete user profile

**`security-design.md`**

- **Purpose**: Define security measures and authentication patterns
- **Objective**: Establish security protocols and user authentication flows
- **Contains**: Authentication flows, authorization patterns, data encryption, security headers

#### Design Specification Requirements

Each design file must include:

1. **Function Name**: Clear, descriptive name for the component/function
2. **Objective**: What this component/function is designed to achieve
3. **Path & Filename**: Exact file location (e.g., `src/components/pages/home/HomePage.tsx`)
4. **Parameters/Request/Response/Result**: Input/output specifications
5. **Requirement Relation**: Which requirement file this design addresses
6. **Relations**: Dependencies and usage relationships
7. **More Details**: Implementation specifics, edge cases, performance considerations

## Implementation Phase (`*code`)

#### Purpose

The Implementation Phase is the third phase of the Software Development Life Cycle (SDLC) that focuses on translating design specifications into working code. It involves creating the actual software components, services, and functionality according to the established design patterns.

#### Main Objective

**Create or edit files in `ai/03-implementation/`** - Implementation documents (SDLC Phase 3)

#### Objective

To implement all designed features and components according to specifications, ensuring code quality, maintainability, and adherence to established patterns and conventions.

#### Traceability Requirements

Each implementation file must include traceability information:

**Implementation Files** (e.g., `src/components/pages/UserProfile.tsx`, `src/services/UserService.ts`):

- **Traceability**: Must document:
  - **Source Design**: Which design file(s) this implementation follows
  - **Source Requirements**: Which requirement file(s) this implementation addresses
  - **Target Testing**: Which test file(s) will test this implementation
- **Purpose**: Working code that implements specific functionality

#### Implementation Workflow Requirements

**1. Requirements and Design Review**:

- **MANDATORY**: Before implementing any feature, AI must:
  - Read and analyze relevant files in `ai/01-requirements/`
  - Read and analyze relevant files in `ai/02-design/features/`
  - Identify any gaps or inconsistencies between requirements and design
  - Update requirements or design files if inconsistencies are found
  - Document any changes made to requirements or design

**2. Implementation Documentation**:

- **MANDATORY**: Create corresponding `.md` files in `ai/03-implementation/` that:
  - Duplicate the structure from `ai/02-design/features/` for the same feature
  - Document the actual implementation status and progress
  - Record what has been implemented vs. what remains to be done
  - Include implementation notes, decisions, and challenges
  - Maintain traceability to requirements and design

**3. Status Tracking**:

- **Implementation Status**: Each implementation file must track:
  - **Completed**: What has been fully implemented and tested
  - **In Progress**: What is currently being worked on
  - **Pending**: What remains to be implemented
  - **Blocked**: What cannot be implemented due to dependencies or issues
  - **Notes**: Implementation-specific notes, decisions, and challenges

**4. File Structure**:

```
ai/03-implementation/
├── features/
│   ├── event-management-implementation.md
│   └── user-authentication-implementation.md
└── overall/
    ├── architecture-implementation.md
    └── infrastructure-implementation.md
```

## Testing Phase (`*test`)

#### Purpose

The Testing Phase is the fourth phase of the Software Development Life Cycle (SDLC) that focuses on verifying that the implemented code meets requirements and functions correctly. It involves creating and executing various types of tests to ensure quality and reliability.

#### Main Objective

**Create or edit files in `ai/04-testing/`** - Testing documents (SDLC Phase 4)

#### Objective

To create comprehensive test coverage that validates all implemented functionality, ensures code quality, and verifies that requirements are met.

#### Traceability Requirements

Each test file must include traceability information:

**Test Files** (e.g., `user-profile.test.tsx`, `user-service.test.ts`):

- **Traceability**: Must document:
  - **Source Implementation**: Which implementation file(s) this test covers
  - **Source Design**: Which design file(s) this test validates
  - **Source Requirements**: Which requirement file(s) this test verifies
- **Purpose**: Test cases that validate specific functionality

## Deployment Phase (`*deploy`)

#### Purpose

The Deployment Phase is the fifth phase of the Software Development Life Cycle (SDLC) that focuses on deploying the tested and verified software to production environments. It involves configuration, deployment, and post-deployment verification.

#### Main Objective

**Create or edit files in `ai/05-deployment/`** - Deployment documents (SDLC Phase 5)

#### Objective

To successfully deploy the application to production with proper configuration, monitoring, and verification of functionality.

#### Traceability Requirements

Deployment files must include traceability information:

**Deployment Files** (e.g., `deployment-config.md`, `environment-setup.md`):

- **Traceability**: Must document:
  - **Source Implementation**: Which implementation files are being deployed
  - **Source Testing**: Which test results validate the deployment
  - **Source Requirements**: Which requirements are being fulfilled
- **Purpose**: Deployment configuration and procedures

## Quality Assurance

### Document Quality

- Clear and comprehensive specifications
- Proper traceability between phases
- Consistent formatting and structure
- Regular validation and updates

### Code Quality

- Follows established patterns
- Matches design specifications
- Proper error handling
- Comprehensive testing

### Process Quality

- Systematic phase progression
- Proper documentation updates
- Consistent AI behavior
- Regular process validation

## Best Practices

### Phase Progression

- Always follow proper phase order
- Validate prerequisites are met
- Check document consistency
- Verify implementation matches design

### Document Updates

- Always read existing documents before making changes
- Maintain traceability between phases
- Update related documents when making changes
- Preserve document history and version control

### Code Implementation

- Never implement code without proper documentation
- Always follow established patterns and conventions
- Ensure code matches design specifications
- Maintain consistency with existing codebase

### Testing

- Create comprehensive test coverage
- Test all critical paths
- Test error scenarios
- Test accessibility and performance

### Deployment

- Verify all tests pass before deployment
- Use proper deployment procedures
- Monitor deployment success
- Have rollback plan ready

## Conclusion

This implementation guide ensures that AI assistants follow a systematic, documented, and traceable development process for the LNConnext project, maintaining quality and consistency across all phases of the SDLC.

---

_This implementation guide should be followed by all AI assistants working on the LNConnext project to ensure consistent and high-quality development processes._
