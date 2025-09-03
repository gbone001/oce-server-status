# OCE Server Status

OCE Server Status is intended to be a server monitoring and status checking application. Currently, this is a minimal repository containing only basic project files.

**CRITICAL: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Current Repository State

**IMPORTANT**: This repository is currently in its initial state with minimal content:
- Contains only README.md and LICENSE files
- No source code, build system, dependencies, or tests exist yet
- No development environment is configured
- Project structure needs to be established from scratch

## Working Effectively

### Repository Setup
Since this is a fresh repository, you will need to establish the basic project structure:

1. **Initial Assessment**: 
   - Run `ls -la` to confirm current minimal state
   - Repository contains only README.md (19 bytes) and LICENSE (Apache 2.0)

2. **Development Environment Setup**:
   - No specific language or framework has been chosen yet
   - Common choices for server status applications include:
     - Node.js with Express/Fastify
     - Python with Flask/FastAPI  
     - Go with standard library or Gin
     - Rust with Axum or Actix
   - Choose based on project requirements and team preferences

### Build and Test Instructions

**CURRENT STATE**: No build system exists yet.

When a build system is implemented:
- **NEVER CANCEL** long-running builds - server monitoring tools often have complex dependency chains
- Set timeout to 60+ minutes for initial builds
- Set timeout to 30+ minutes for test suites
- Document actual timing once build system is established

### Running the Application

**CURRENT STATE**: No application code exists yet.

Typical server status applications include:
- Web dashboard for status visualization
- API endpoints for programmatic access  
- Background monitoring services
- Database for historical data storage

### Validation Requirements

**CRITICAL VALIDATION STEPS** (implement once codebase exists):
- **ALWAYS** run end-to-end scenarios after making changes
- Test the complete monitoring workflow:
  1. Start the monitoring service
  2. Configure at least one server to monitor
  3. Verify status checks are working
  4. Confirm data is being stored/displayed correctly
- **MANUAL TESTING REQUIRED**: Automated tests alone are insufficient for monitoring applications

## Common Tasks (To Be Updated)

### Current Repository Contents
```bash
ls -la
total 32
drwxr-xr-x 4 runner docker  4096 Sep  3 15:25 .
drwxr-xr-x 3 runner docker  4096 Sep  3 15:22 ..
drwxr-xr-x 7 runner docker  4096 Sep  3 15:24 .git
drwxr-xr-x 2 runner docker  4096 Sep  3 15:25 .github
-rw-r--r-- 1 runner docker 11357 Sep  3 15:22 LICENSE
-rw-r--r-- 1 runner docker    19 Sep  3 15:22 README.md
```

### .github Directory Contents
```bash
ls -la .github/
total 16
drwxr-xr-x 2 runner docker 4096 Sep  3 15:25 .
drwxr-xr-x 4 runner docker 4096 Sep  3 15:25 ..
-rw-r--r-- 1 runner docker 5629 Sep  3 15:25 copilot-instructions.md
```

### README.md Content
```bash
cat README.md
# oce-server-status
```

## Development Guidance

### Next Steps for Repository Development
When implementing the server status application:

1. **Choose Technology Stack**:
   - Consider scalability requirements
   - Evaluate team expertise
   - Select appropriate monitoring libraries

2. **Establish Project Structure**:
   - Create source code directories
   - Set up package management (package.json, requirements.txt, go.mod, etc.)
   - Configure linting and formatting tools
   - Establish testing framework

3. **Implement Core Features**:
   - Server connectivity testing
   - Status dashboard
   - Alert system
   - Data persistence

4. **Set Up CI/CD**:
   - Create .github/workflows/ for automated testing
   - Configure deployment pipelines
   - Set up security scanning

### Build Time Expectations (To Be Measured)
- **Initial setup**: Time varies by technology choice - measure and document
- **Dependency installation**: Usually 2-10 minutes - **NEVER CANCEL**, set 30+ minute timeout
- **Full build**: TBD - measure first build and add 50% buffer for timeout
- **Test execution**: TBD - measure and document with appropriate timeouts

### Important Locations (To Be Established)
- `/src` or equivalent - main application code
- `/tests` or equivalent - test suites  
- `/docs` - documentation
- `/config` - configuration files
- `/.github/workflows` - CI/CD pipelines

## Validation Scenarios (Future Implementation)

When the application is developed, always test these scenarios:

1. **Basic Monitoring Test**:
   - Configure monitoring for localhost
   - Verify status check executes successfully
   - Confirm results are displayed correctly

2. **Multi-Server Test**:
   - Configure multiple servers
   - Verify concurrent monitoring
   - Test status aggregation

3. **Alert System Test**:
   - Simulate server failure
   - Verify alerts are triggered
   - Test notification delivery

4. **Dashboard Functionality**:
   - Load web interface (if applicable)
   - Navigate through different views
   - Verify real-time updates

## Critical Reminders

- **NEVER CANCEL** builds or tests - monitoring applications often have complex dependency chains
- **ALWAYS** validate instructions by running complete user scenarios
- **SET EXPLICIT TIMEOUTS** of 60+ minutes for builds, 30+ minutes for tests
- **MANUAL TESTING REQUIRED** - automated tests alone are insufficient for monitoring tools
- Update these instructions as the codebase evolves

## Notes for Future Updates

As the repository evolves, update this file to include:
- Specific build commands and timing measurements
- Technology-specific setup instructions  
- Detailed validation procedures
- Configuration requirements
- Deployment instructions
- Performance benchmarks and expectations