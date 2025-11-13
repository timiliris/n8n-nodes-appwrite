# Contributing to n8n-nodes-appwrite-full

Thank you for your interest in contributing to n8n-nodes-appwrite-full! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 7 or higher
- Git
- n8n installed (for testing)
- Appwrite account (for integration testing)

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-nodes-appwrite-full.git
   cd n8n-nodes-appwrite-full
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Link the package for local testing:
   ```bash
   npm link
   cd ~/.n8n/nodes
   npm link n8n-nodes-appwrite-full
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate files:
   - Node logic: `nodes/Appwrite/Appwrite.node.ts`
   - Credentials: `credentials/AppwriteApi.credentials.ts`
   - Tests: `test/`

3. Build and test your changes:
   ```bash
   npm run build
   npm run lint
   npm test
   ```

4. Test in n8n:
   ```bash
   npm run dev
   ```

### Code Style

- Use TypeScript for all code
- Follow the existing code style
- Run `npm run lint` and fix any issues
- Run `npm run format` to format code
- Use meaningful variable and function names
- Add comments for complex logic
- Use type annotations

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add support for Teams service operations
fix: resolve error handling in document creation
docs: update README with new examples
```

### Testing

#### Unit Tests

Write unit tests for all new functionality:

```typescript
describe('New Feature', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

Run tests:
```bash
npm test
```

#### Integration Tests

For features that interact with Appwrite:

1. Set up a test Appwrite project
2. Create test credentials
3. Write integration tests
4. Mark them as skippable for CI if needed

### Adding New Operations

When adding new operations to existing resources:

1. Add the operation to the options in `Appwrite.node.ts`
2. Add required fields for the operation
3. Implement the operation logic in the `execute()` method
4. Add tests
5. Update documentation

Example structure:
```typescript
{
  name: 'New Operation',
  value: 'newOperation',
  description: 'Description of what it does',
  action: 'Perform new operation',
}
```

### Adding New Resources

When adding support for new Appwrite services:

1. Add the resource to the resource options
2. Create operation options for the resource
3. Add all required fields
4. Implement service logic using Appwrite SDK
5. Handle errors appropriately
6. Add comprehensive tests
7. Update README

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with a note describing your changes
3. Ensure all tests pass and linting is clean
4. Update documentation and examples as needed
5. Create a pull request with a clear title and description
6. Link any related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Manually tested in n8n

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] CHANGELOG.md updated
```

## Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps to reproduce the issue
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment**:
   - n8n version
   - Node.js version
   - Appwrite version
   - Operating system
6. **Screenshots** - If applicable
7. **Error Messages** - Full error messages and stack traces

## Feature Requests

When requesting features:

1. Check if the feature has already been requested
2. Provide a clear use case
3. Explain the expected behavior
4. Consider implementation details if possible
5. Be open to discussion and alternatives

## Questions?

If you have questions about contributing:

- Check existing documentation
- Search closed issues for similar questions
- Open a new issue with the "question" label
- Be specific and provide context

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- CHANGELOG.md

Thank you for contributing to n8n-nodes-appwrite-full!
