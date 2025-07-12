# Context Window Management in Claudia

## Overview

Unlike the standard Claude Code CLI that shows context window percentage when it reaches ≤40%, Claudia handles context management differently. This guide explains how context works in the Claudia desktop application and what users should do to manage it effectively.

## Current Context Features

### Token Tracking

Claudia provides basic token tracking through a **floating token counter**:

- **Location**: Bottom-right corner of the screen (fixed position)
- **Display**: Shows total tokens used in the current session (e.g., "1,234 tokens")
- **Calculation**: Sums `input_tokens` + `output_tokens` from each message
- **Visibility**: Automatically hides when token count is 0

### What's Missing

**Claudia currently does NOT have:**
- Context window percentage display
- Automatic warnings when approaching context limits
- Built-in `/compact` command
- Context window size indicators
- Automatic context summarization

## Context Window Limits by Model

Understanding the limits helps you manage your sessions effectively:

| Model | Typical Context Window |
|-------|----------------------|
| Claude 3 Haiku | ~100,000 tokens |
| Claude 3 Sonnet | ~200,000 tokens |
| Claude 3 Opus | ~200,000 tokens |
| Claude 3.5 Sonnet | ~200,000 tokens |

## Manual Context Management Strategies

Since Claudia lacks automatic context management, users need to employ manual strategies:

### 1. Monitor Token Usage

- Keep an eye on the token counter in the bottom-right
- Be aware of approximate limits for your chosen model
- Start planning for a new session when approaching 80% of the limit

**Example Calculations:**
- For Sonnet (200k limit): Consider new session around 160,000 tokens
- For Haiku (100k limit): Consider new session around 80,000 tokens

### 2. Session Management Techniques

#### Start Fresh Sessions
- Click the "+" (New Session) button on any project card
- Creates a completely new conversation without previous context
- Best for: Starting new tasks, different topics, or when context is full

#### Use Timeline Forking
- Navigate to any point in your conversation timeline
- Create a checkpoint and fork to a new session
- Preserves context up to that specific point
- Best for: Exploring alternative approaches, backing up from errors

### 3. Organize Conversations by Purpose

**Recommended Session Types:**
- **Feature Development**: One session per major feature
- **Bug Fixes**: Separate sessions for different bugs
- **Code Reviews**: Dedicated sessions for review tasks
- **Documentation**: Separate sessions for docs work
- **Exploration**: Short sessions for quick questions

### 4. Context Preservation Techniques

#### CLAUDE.md Files
- Create project-specific context files
- Include project structure, coding standards, and key information
- Automatically loaded for new sessions
- Provides persistent context across all sessions

**Example CLAUDE.md structure:**
```markdown
# Project Context

## Overview
Brief description of the project, its purpose, and main technologies.

## Architecture
Key architectural decisions and patterns used.

## Coding Standards
- Style guides
- Naming conventions
- Testing requirements

## Important Files
- Key files and their purposes
- Configuration locations
- Entry points
```

#### Strategic Information Placement
- Include critical project info in early messages
- Reference important files frequently
- Use descriptive commit messages and comments
- Maintain consistent naming conventions

## Workarounds for Missing Features

### Create Custom Slash Commands

Since there's no built-in `/compact` command, create your own:

**File**: `~/.claude/commands/new-session.md`
```markdown
---
allowed-tools: []
description: "Guidance for starting a new session"
---
It's time to start a new session to manage context limits.

Before starting fresh:
1. Save any important outputs or code
2. Note the current task progress
3. Create a checkpoint if needed

When you start the new session, begin with:
"Continue from previous session. We were working on: $ARGUMENTS

Key context to remember:
- [Summarize important decisions made]
- [List completed tasks]
- [Note any important code changes]
- [Include relevant file paths]"
```

### Monitor and Plan Ahead

**Signs it's time for a new session:**
- Token counter shows high numbers (approaching model limits)
- Conversation has been running for several hours
- You're switching to a completely different task
- Claude starts having trouble following context
- You want to explore an alternative approach

### Session Transition Best Practices

**When starting a new session:**

1. **Document Current State**
   - Summarize what was accomplished
   - Note any important decisions or code changes
   - List files that were modified

2. **Transfer Key Context**
   - Include project overview in first message
   - Reference the CLAUDE.md file
   - Mention specific files or functions being worked on

3. **Provide Clear Instructions**
   - Start with a clear task description
   - Reference previous work if relevant
   - Specify any constraints or requirements

**Example new session starter:**
```
Continue working on the user authentication feature. 

Previous session completed:
- User login form component (src/components/LoginForm.tsx)
- Authentication API endpoints (src/api/auth.ts)
- Password validation logic

Still needed:
- Registration form
- Password reset functionality
- Session management

Project uses React + TypeScript + Express. Follow the existing patterns in the codebase.
```

## Future Improvements

The Claudia development team could consider adding:

- **Context percentage indicator**: Show usage relative to model limits
- **Smart warnings**: Alert when approaching 80-90% of context
- **Built-in compacting**: Automatic or manual session summarization
- **Context transfer tools**: Better tools for moving between sessions
- **Session templates**: Pre-defined session starters for common tasks

## Recommendations

**For optimal context management:**

1. **Be proactive**: Don't wait until you hit limits
2. **Use CLAUDE.md**: Maintain project context files
3. **Plan sessions**: Think about logical breakpoints
4. **Monitor tokens**: Keep an eye on the counter
5. **Create checkpoints**: Use timeline features before major changes
6. **Document progress**: Make session transitions smooth

**When in doubt**: Start a new session rather than risk hitting context limits. It's easier to provide context in a new session than to recover from a context-limited conversation.

## Conclusion

While Claudia doesn't have the automatic context management features of the CLI, its session management and timeline features provide powerful alternatives. The key is to be proactive about managing context and use the available tools strategically to maintain productive conversations with Claude.