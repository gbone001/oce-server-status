# OCE Server Status Repository

This is the OCE Server Status repository. Currently, this is a minimal repository containing only basic project structure with LICENSE and README files.

**ALWAYS FOLLOW THESE INSTRUCTIONS FIRST** and only fallback to additional search and context gathering if the information in these instructions is incomplete or found to be in error.

## Repository Status

This repository is currently in an **initial/minimal state** containing:
- Apache 2.0 LICENSE file
- Basic README.md with project title
- Git history and repository structure
- No application code, build system, or dependencies yet

## Working Effectively

### Current Repository State
- Run these commands to understand the current state:
  - `ls -la` to see all files in repository root
  - `git --no-pager log --oneline -10` to view recent commits
  - `git --no-pager status` to check working directory status

### Repository Navigation
- Repository root contains: LICENSE, README.md, .git/, .github/
- No source code directories exist yet
- No build scripts or configuration files exist yet
- No dependencies or package managers configured yet

### Version Control Operations
- Always run `git --no-pager status` before making changes
- Use `git --no-pager diff` to review changes before committing
- Current branch structure: check with `git --no-pager branch -a`

## Development Setup (Future)

When application code is added to this repository, developers will need to:

### Prerequisites
- Verify system requirements based on chosen technology stack
- Install appropriate runtime/SDK when application code is added
- Configure any required environment variables

### Build Instructions (Not Yet Applicable)
**Currently no build system exists.** When code is added:
- Document exact build commands and validate they work
- Include timeout expectations for long-running builds
- Add "NEVER CANCEL" warnings for commands taking >2 minutes
- Test build process from clean repository state

### Testing Instructions (Not Yet Applicable)
**Currently no test suite exists.** When tests are added:
- Document exact test commands with expected runtime
- Include timeout values for test execution
- Provide validation scenarios for manual testing
- Document any test data or fixtures required

### Running the Application (Not Yet Applicable)
**Currently no application exists.** When application code is added:
- Document exact commands to start the application
- Include any required configuration steps
- Provide URLs for accessing the running application
- Document expected startup time and indicators of successful launch

## Validation

### Current Validation Steps
Since this is a minimal repository, validation is limited to:
- Verify repository structure: `ls -la`
- Check git status: `git --no-pager status`
- Review recent history: `git --no-pager log --oneline -5`
- Validate file integrity: `file LICENSE README.md`

### Future Validation Requirements
When application code is added, always:
- Run complete build process before committing changes
- Execute full test suite with appropriate timeouts
- Perform manual end-to-end testing of key user scenarios
- Validate all commands in these instructions actually work
- Test from fresh clone to ensure reproducibility

## Common Tasks

### Repository Exploration
```bash
# View repository structure
ls -la

# Check git status
git --no-pager status

# View file contents
cat README.md
cat LICENSE
```

### File Operations
```bash
# View file types
file *

# Check for hidden files
find . -name ".*" -type f | grep -v ".git"

# Basic repository info
pwd
git --no-pager remote -v
```

## Important Notes

### Current Limitations
- **No build system**: Cannot build application (none exists yet)
- **No test framework**: Cannot run tests (none exist yet) 
- **No application code**: Cannot start or run application
- **No dependencies**: No package managers or dependency files configured
- **No CI/CD**: No automated workflows configured (except basic Copilot workflow)

### Future Development Guidelines
When adding application code to this repository:

1. **Update these instructions** immediately after adding code
2. **Document all build requirements** with exact commands and timeouts
3. **Add validation scenarios** that test real functionality
4. **Include timing expectations** for all long-running operations
5. **Test instructions thoroughly** from fresh repository clone
6. **Never document commands that don't work** - always validate first

### Build Time Expectations (Future)
When build system is added, document:
- Expected build time (e.g., "Build takes 5 minutes - NEVER CANCEL, use timeout 10+ minutes")
- Expected test time (e.g., "Tests take 2 minutes - NEVER CANCEL, use timeout 5+ minutes")
- Any known limitations or platform-specific issues

## Getting Started for New Developers

1. Clone the repository
2. Read these instructions completely
3. Run validation commands to understand current state
4. Check recent commits to understand development direction
5. If adding new functionality, update these instructions accordingly

Remember: These instructions should always be your first reference point. Only use additional search or exploration when these instructions are incomplete or incorrect.