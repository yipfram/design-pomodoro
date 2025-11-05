# Claude AI Instructions

## Version Management

**IMPORTANT: Always increment the version for EVERY change you make to this project.**

### Version Incrementing Rules

Follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

1. **Patch Version (x.x.PATCH)** - Increment by 0.0.1 for:
   - Bug fixes
   - Minor text/documentation changes
   - Small UI tweaks
   - Performance improvements
   - Refactoring without behavior changes
   - Example: 1.0.0 → 1.0.1

2. **Minor Version (x.MINOR.0)** - Increment by 0.1.0 for:
   - New features
   - New functionality
   - Significant UI changes
   - Adding new components
   - API changes (backwards-compatible)
   - Example: 1.0.1 → 1.1.0

3. **Major Version (MAJOR.0.0)** - Increment by 1.0.0 for:
   - Breaking changes
   - Major rewrites
   - Incompatible API changes
   - Example: 1.1.0 → 2.0.0

### Required Steps for Every Change

When making any change to the codebase:

1. **Update package.json** - Change the `version` field
2. **Update CHANGELOG.md** - Add entry under appropriate version section
3. **Commit** - Include version number in commit message
4. **Push** - Push changes to the branch

### Changelog Format

Use the following format in CHANGELOG.md:

```markdown
## [VERSION] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Removed
- Removed features
```

## Project Information

- **Name**: Zen Pomodoro Timer
- **Current Version**: Check package.json for the latest version
- **Technology Stack**: React, TypeScript, Vite, PWA
- **Purpose**: A minimalist Pomodoro timer application with task management

## Development Guidelines

- Follow existing code style and patterns
- Test changes thoroughly before committing
- Keep the Zen minimalist design aesthetic
- Ensure PWA functionality remains intact
- Maintain mobile responsiveness
