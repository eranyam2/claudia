# Claude Code Features Guide

This comprehensive guide covers all the powerful features available in Claude Code agents, hooks system, and slash commands. Learn how to leverage these tools to enhance your development workflow.

## Table of Contents

1. [Claude Code Agents](#claude-code-agents)
2. [Hooks System](#hooks-system)
3. [Slash Commands](#slash-commands)

---

## Claude Code Agents

### What are Claude Code Agents?

Claude Code agents are pre-configured AI assistants that can be executed within the Claudia desktop application. They are specialized versions of Claude that have been given specific system prompts, default tasks, and configurations to excel at particular tasks. Think of them as AI specialists that you can summon to perform specific jobs in your codebase.

### Core Agent Structure

Each agent is defined by the following properties:

```typescript
interface Agent {
  id?: number;
  name: string;
  icon: string;
  system_prompt: string;
  default_task?: string;
  model: string;
  hooks?: string; // JSON string of HooksConfiguration
  created_at: string;
  updated_at: string;
}
```

### Agent Capabilities

1. **Customizable System Prompts**: Each agent has a system prompt that defines its personality, expertise, and approach to tasks.

2. **Model Selection**: Agents can use different Claude models:
   - `haiku` - For simple, fast tasks
   - `sonnet` - General purpose (default)
   - `opus` - For complex reasoning tasks

3. **Default Tasks**: Agents can have pre-defined default tasks that users can modify when executing.

4. **Icons**: Visual identification using various icons (bot, shield, code, terminal, database, globe, file-text, git-branch, etc.)

5. **Hooks Support**: Agents can have hooks that execute commands at various points during execution.

### Example Agents

#### 1. Git Commit Bot
```json
{
  "name": "Git Commit Bot",
  "icon": "bot",
  "model": "sonnet",
  "default_task": "Push all changes.",
  "system_prompt": "You are a Git Commit Push bot. Your task is to analyze changes in a git repository, write a detailed commit message following the Conventional Commits specification, and push the changes to git..."
}
```

**Use Case**: Automatically analyze your changes, generate proper commit messages, and push to git following best practices.

#### 2. Security Scanner
```json
{
  "name": "Security Scanner",
  "icon": "shield",
  "model": "opus",
  "default_task": "Review the codebase for security issues.",
  "system_prompt": "You are an advanced AI-powered Static Application Security Testing (SAST) agent specialized in performing deep, comprehensive security audits of codebases..."
}
```

**Use Case**: Perform comprehensive security audits of your codebase, identifying vulnerabilities and security best practices violations.

#### 3. Unit Tests Bot
```json
{
  "name": "Unit Tests Bot",
  "icon": "code",
  "model": "opus",
  "default_task": "Generate unit tests for this codebase."
}
```

**Use Case**: Automatically generate comprehensive unit tests for your code with proper test coverage and edge cases.

### How Agents Work

1. **Storage**: Agents are stored in a local SQLite database (`agents.db`)

2. **Execution**: When an agent is executed:
   - It spawns a Claude Code process with the agent's system prompt
   - The process runs in the specified project directory
   - Output is streamed in real-time to the UI
   - Session data is stored in JSONL files

3. **Process Management**: The system tracks:
   - Running processes with PIDs
   - Execution status (pending, running, completed, failed, cancelled)
   - Session IDs for output retrieval
   - Metrics (tokens used, duration, cost)

### Agent Import/Export

Agents can be shared using the `.claudia.json` format:

```json
{
  "version": 1,
  "exported_at": "2025-01-23T14:29:58.156063+00:00",
  "agent": {
    "name": "Your Agent Name",
    "icon": "bot",
    "model": "opus|sonnet|haiku",
    "system_prompt": "Your agent's instructions...",
    "default_task": "Default task description",
    "hooks": "{...}" // Optional hooks configuration
  }
}
```

### Agent Use Cases

Agents are perfect for:
- **Automated code reviews**: Review code for best practices and potential issues
- **Security scanning**: Identify vulnerabilities and security weaknesses
- **Test generation**: Create comprehensive unit and integration tests
- **Documentation writing**: Generate technical documentation and README files
- **Git workflow automation**: Handle commits, branching, and releases
- **Code refactoring**: Modernize and optimize existing code
- **API testing**: Test endpoints and validate responses
- **Database migrations**: Handle schema changes and data transformations
- **Custom workflows**: Any specialized task specific to your project

---

## Hooks System

### Overview

The hooks system allows users to configure shell commands that execute at various points during Claude Code's lifecycle. This provides powerful automation and customization capabilities.

### Hook Events Available

1. **PreToolUse** - Runs before tool calls, can block execution and provide feedback
2. **PostToolUse** - Runs after successful tool completion
3. **Notification** - Customizes notifications when Claude needs attention
4. **Stop** - Runs when Claude finishes responding
5. **SubagentStop** - Runs when a Claude subagent (Task) finishes

### Hook Configuration Structure

```typescript
interface HooksConfiguration {
  PreToolUse?: HookMatcher[];      // Tool-related hooks with matchers
  PostToolUse?: HookMatcher[];     // Tool-related hooks with matchers
  Notification?: HookCommand[];    // Direct commands without matchers
  Stop?: HookCommand[];            // Direct commands without matchers
  SubagentStop?: HookCommand[];   // Direct commands without matchers
}

interface HookMatcher {
  matcher?: string;              // Pattern to match tool names (regex supported)
  hooks: HookCommand[];         // Commands to run when pattern matches
}

interface HookCommand {
  type: 'command';
  command: string;              // Shell command to execute
  timeout?: number;             // Optional timeout in seconds (default: 60)
}
```

### Hook Scopes

Hooks can be configured at three different scopes with the following priority (highest to lowest):
1. **Local** - Project-specific, not committed to version control
2. **Project** - Project-specific, shared with team
3. **User** - Global for all projects

### Common Tool Matchers

The system provides these common tool matchers for convenience:
- `Task`, `Bash`, `Glob`, `Grep`
- `Read`, `Edit`, `MultiEdit`, `Write`
- `WebFetch`, `WebSearch`
- `Notebook.*` - Matches all notebook tools
- `Edit|Write` - Matches either Edit or Write
- `mcp__.*` - Matches all MCP tools
- `mcp__memory__.*`, `mcp__filesystem__.*`, `mcp__github__.*` - MCP subcategories

### Example Hook Configurations

#### 1. Log All Bash Commands
```json
{
  "PreToolUse": [{
    "matcher": "Bash",
    "hooks": [{
      "type": "command",
      "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
    }]
  }]
}
```

**Use Case**: Audit all bash commands executed by Claude for security and compliance.

#### 2. Auto-format Code on Save
```json
{
  "PostToolUse": [{
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [{
      "type": "command",
      "command": "if [[ \"$( jq -r .tool_input.file_path )\" =~ \\.(ts|tsx|js|jsx)$ ]]; then prettier --write \"$( jq -r .tool_input.file_path )\"; fi"
    }]
  }]
}
```

**Use Case**: Automatically format code files whenever Claude modifies them.

#### 3. Prevent Commits to Main Branch
```json
{
  "PreToolUse": [{
    "matcher": "Bash",
    "hooks": [{
      "type": "command",
      "command": "if [[ \"$(jq -r .tool_input.command)\" =~ \"git commit\" ]] && [[ \"$(git branch --show-current 2>/dev/null)\" =~ ^(main|master)$ ]]; then echo \"Direct commits to main/master branch are not allowed\"; exit 2; fi"
    }]
  }]
}
```

**Use Case**: Enforce branching policies by preventing direct commits to protected branches.

#### 4. Run Tests After Code Changes
```json
{
  "PostToolUse": [{
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [{
      "type": "command",
      "command": "if [[ \"$( jq -r .tool_input.file_path )\" =~ \\.(ts|tsx|js|jsx)$ ]]; then npm test -- --testPathPattern=\"$(dirname \"$( jq -r .tool_input.file_path )\")\" --passWithNoTests; fi"
    }]
  }]
}
```

**Use Case**: Automatically run relevant tests when code files are modified.

#### 5. Backup Important Files
```json
{
  "PreToolUse": [{
    "matcher": "Edit|Write",
    "hooks": [{
      "type": "command",
      "command": "FILE=\"$(jq -r .tool_input.file_path)\"; if [[ -f \"$FILE\" ]]; then cp \"$FILE\" \"$FILE.backup.$(date +%s)\"; fi"
    }]
  }]
}
```

**Use Case**: Create timestamped backups before modifying important files.

### Hook Context Variables

Hooks receive context via stdin as JSON, which can be accessed using tools like `jq`:
- For tool hooks: `tool_input` contains the tool parameters
- For notification hooks: `message` and `title` fields
- For stop hooks: `transcript_path` contains the session transcript

### Security Features

The system includes built-in protection against dangerous commands:
- Detects destructive commands (rm -rf /, fork bombs, etc.)
- Warns about unquoted shell variables
- Validates regex patterns
- Supports command timeouts to prevent hanging

### Hook Command Exit Codes

- Exit code 0: Success, continue normally
- Exit code 2: Block the tool execution (PreToolUse only)
- Other exit codes: Treated as errors

---

## Slash Commands

### Overview

Slash commands in Claudia are custom shortcuts that allow users to quickly insert predefined prompts and workflows. They start with a `/` character and can include namespaces for better organization.

### Built-in/Default Slash Commands

The application includes three default slash commands:

#### 1. `/add-dir`
- **Purpose**: Add additional working directories to your current session
- **Description**: Allows you to expand the scope of your project by including additional directories
- **Arguments**: No arguments required
- **Example**: `/add-dir` → Prompts to select additional directories to include

#### 2. `/init`
- **Purpose**: Initialize a project with a CLAUDE.md guide file
- **Description**: Creates a CLAUDE.md file in your project to help guide Claude in understanding your project structure and requirements
- **Arguments**: No arguments required
- **Example**: `/init` → Creates a structured CLAUDE.md file with project guidelines

#### 3. `/review`
- **Purpose**: Request a code review
- **Description**: Triggers Claude to review code for best practices, potential issues, and improvements
- **Arguments**: No arguments required
- **Example**: `/review` → Performs a comprehensive code review of the current project

### Custom Slash Commands

Users can create custom slash commands in two scopes:

1. **User Commands (Global)**
   - Location: `~/.claude/commands/`
   - Available across all projects
   - Example: `/explain`, `/fix-issue`, `/test`

2. **Project Commands**
   - Location: `<project-path>/.claude/commands/`
   - Only available within that specific project
   - Example: `/project:deploy`, `/project:frontend:component`

### Command Structure

Slash commands are stored as Markdown files with optional YAML frontmatter:

```markdown
---
allowed-tools: [Read, Edit, MultiEdit, Write, Bash]
description: "Brief description of what this command does"
---

The main content of your command goes here.

Use special placeholders:
- $ARGUMENTS - Replaced with user-provided arguments
- @filename - Reference files
- !`command` - Execute bash commands
```

### Example Custom Commands

#### 1. Code Review Command
**File**: `~/.claude/commands/review.md`
```markdown
---
allowed-tools: [Read, Grep]
description: "Review code for best practices"
---
Review the following code for best practices, potential issues, and improvements:

@$ARGUMENTS

Please check for:
- Code quality and maintainability
- Performance optimizations
- Security vulnerabilities
- Best practices compliance
```

**Usage**: `/review src/components/Button.tsx`

#### 2. Explain Command
**File**: `~/.claude/commands/explain.md`
```markdown
---
allowed-tools: [Read, Grep, WebSearch]
description: "Explain how something works"
---
Explain how $ARGUMENTS works in detail, including:

1. Purpose and functionality
2. Implementation details
3. Usage examples
4. Best practices
5. Common pitfalls to avoid

Please provide comprehensive documentation with code examples.
```

**Usage**: `/explain React useEffect hook`

#### 3. Fix Issue Command
**File**: `~/.claude/commands/fix-issue.md`
```markdown
---
allowed-tools: [Read, Edit, MultiEdit, Write, Bash]
description: "Fix a specific issue"
---
Fix issue #$ARGUMENTS following our coding standards and best practices.

Steps to follow:
1. Analyze the issue and understand the root cause
2. Implement the fix with proper error handling
3. Add or update relevant tests
4. Update documentation if needed
5. Verify the fix works correctly
```

**Usage**: `/fix-issue 123`

#### 4. Test Writing Command
**File**: `~/.claude/commands/test.md`
```markdown
---
allowed-tools: [Read, Write, Edit]
description: "Write comprehensive tests"
---
Write comprehensive tests for:

@$ARGUMENTS

Include:
- Unit tests for all public methods
- Edge cases and error scenarios
- Integration tests where appropriate
- Mocking for external dependencies
- Proper test descriptions and documentation
```

**Usage**: `/test src/utils/validation.ts`

#### 5. Component Generator
**File**: `<project>/.claude/commands/frontend/component.md`
```markdown
---
allowed-tools: [Write, Edit, Read]
description: "Generate a React component"
---
Create a new React component named $ARGUMENTS with:

1. TypeScript interface for props
2. Proper JSX structure
3. CSS modules for styling
4. Unit tests
5. Storybook stories
6. Documentation comments

Follow our project's component conventions and patterns.
```

**Usage**: `/frontend:component UserProfile`

#### 6. API Generator
**File**: `<project>/.claude/commands/backend/api.md`
```markdown
---
allowed-tools: [Write, Edit, Read, Bash]
description: "Generate API endpoint"
---
Create a new API endpoint for $ARGUMENTS including:

1. Route handler with proper HTTP methods
2. Input validation schema
3. Database operations
4. Error handling
5. API documentation
6. Unit and integration tests

Follow REST API best practices and our project structure.
```

**Usage**: `/backend:api user-management`

### Command Features

1. **Namespaces**: Commands can be organized with namespaces
   - Example: `/frontend:component` or `/backend:api`
   - The file structure determines the namespace

2. **Arguments**: Commands can accept dynamic arguments
   - Use `$ARGUMENTS` placeholder in the command content
   - Example: `/fix-issue #123` where `#123` replaces `$ARGUMENTS`

3. **Tool Restrictions**: Specify which tools Claude can use
   - Common tools: Read, Write, Edit, MultiEdit, Bash, Grep, WebSearch
   - Defined in the `allowed-tools` frontmatter field

4. **Special Syntax**:
   - `@filename` - Reference and include file contents
   - `!`command`` - Execute bash commands inline
   - `$ARGUMENTS` - Dynamic user input placeholder

### How to Use Slash Commands

1. **In the chat input**: Type `/` to trigger the slash command picker
2. **Browse commands**: Navigate through Default and Custom tabs
3. **Search**: Type after the `/` to filter commands
4. **Select**: Use arrow keys or click to select a command
5. **Add arguments**: If the command accepts arguments, type them after selection

### Creating Custom Commands

#### Via UI (Recommended)
1. Go to Settings → Slash Commands or Project Settings → Slash Commands
2. Click "New Command"
3. Fill in the form with name, content, and allowed tools
4. Save

#### Via File System
1. Create a `.md` file in `~/.claude/commands/` or `<project>/.claude/commands/`
2. Add optional YAML frontmatter for configuration
3. Write your command content using markdown

### Best Practices

1. **Use descriptive names**: Make command names self-explanatory
2. **Add descriptions**: Help users understand what each command does
3. **Limit tool access**: Only enable tools the command actually needs
4. **Use namespaces**: Organize related commands together
5. **Document arguments**: Clearly indicate if a command expects arguments
6. **Test commands**: Verify they work as expected before regular use
7. **Version control**: Include project commands in your repository
8. **Template consistency**: Use consistent formatting across commands

### Advanced Features

1. **File References**: Include multiple files using `@path/to/file`
2. **Bash Integration**: Execute commands with `!`ls -la``
3. **Conditional Content**: Use markdown formatting for complex prompts
4. **Project-Specific Workflows**: Create commands tailored to your project's needs
5. **Team Collaboration**: Share commands with your team through version control

---

## Integration Examples

### Combining Agents, Hooks, and Slash Commands

Here's how you can combine all three features for a powerful development workflow:

#### Example: Automated Testing Workflow

1. **Slash Command**: `/test-and-review`
```markdown
---
allowed-tools: [Read, Write, Edit, Bash]
description: "Run tests and perform code review"
---
1. Run all tests for the project
2. Generate a coverage report
3. Perform a code review focusing on test coverage
4. Suggest improvements for untested code paths

Target: @$ARGUMENTS
```

2. **Hook**: Auto-run tests after code changes
```json
{
  "PostToolUse": [{
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [{
      "type": "command",
      "command": "npm test -- --coverage --passWithNoTests"
    }]
  }]
}
```

3. **Agent**: Test Generation Specialist
```json
{
  "name": "Test Generator",
  "icon": "code",
  "model": "opus",
  "default_task": "Generate comprehensive tests for the codebase",
  "system_prompt": "You are a testing specialist. Generate thorough unit tests, integration tests, and end-to-end tests with high coverage and edge case handling."
}
```

This combination provides:
- Quick access to testing workflows via slash commands
- Automatic test execution when code changes
- Specialized AI assistance for test generation

### Tips for Maximum Productivity

1. **Start with defaults**: Use built-in slash commands and agents first
2. **Customize gradually**: Add custom commands and hooks as you identify repetitive tasks
3. **Share with team**: Export agents and include project commands in version control
4. **Monitor performance**: Use hooks to track and optimize development workflows
5. **Iterate and improve**: Regularly review and refine your custom configurations

---

This guide provides a comprehensive overview of all Claude Code features. Experiment with these tools to find the perfect combination for your development workflow!