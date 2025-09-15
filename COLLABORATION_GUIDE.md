# Playwright Testing Framework - Collaboration Guide

## Repository Setup for Team Collaboration

### 1. Repository Structure
- **`master`** - Main production branch (protected)
- **`develop`** - Integration branch for ongoing development
- **Feature branches** - Individual feature development (e.g., `feature/new-test-suite`)
- **Bugfix branches** - Bug fixes (e.g., `bugfix/login-issue`)

### 2. Branch Protection Rules (Already configured)
- Direct pushes to `master` are blocked
- Pull requests required for merging to `master`
- At least 1 reviewer required
- Status checks must pass before merging

## For New Collaborators

### Initial Setup
```bash
# 1. Clone the repository
git clone https://github.com/JaybhanTomar/playwright-test-automation.git
cd playwright-test-automation

# 2. Verify you're on master branch
git branch -a

# 3. Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# 4. Install dependencies
npm install

# 5. Install Playwright browsers
npx playwright install
```

### Daily Workflow

#### Starting New Feature/Task
```bash
# 1. Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch from develop
git checkout -b feature/your-feature-name

# 3. Work on your changes
# ... make your code changes ...

# 4. Commit your changes
git add .
git commit -m "feat: add new test suite for user management"

# 5. Push feature branch
git push -u origin feature/your-feature-name
```

#### Creating Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request" for your feature branch
3. Set base branch to `develop` (not master)
4. Add description of changes
5. Request review from team member
6. Wait for approval and merge

#### After Feature is Merged
```bash
# 1. Switch back to develop
git checkout develop

# 2. Pull latest changes
git pull origin develop

# 3. Delete local feature branch
git branch -d feature/your-feature-name

# 4. Delete remote feature branch (optional)
git push origin --delete feature/your-feature-name
```

## For Repository Owner (You)

### Initial Setup for Collaboration
```bash
# 1. Create develop branch from master
git checkout master
git checkout -b develop
git push -u origin develop

# 2. Set develop as default branch for new PRs (optional)
# This can be done in GitHub settings
```

### Release Workflow (When ready to deploy)
```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. Final testing and bug fixes on release branch
# ... test and fix any issues ...

# 3. Merge release to master via PR
# Create PR: release/v1.0.0 → master

# 4. After master merge, tag the release
git checkout master
git pull origin master
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 5. Merge master back to develop
git checkout develop
git merge master
git push origin develop
```

## Testing Before Commits

### Run Tests Locally
```bash
# Run all tests
npm run test

# Run specific test suite
npx playwright test tests/Sanity/

# Run tests with UI
npx playwright test --ui

# Generate Allure report
npm run allure:generate
npm run allure:open
```

### Pre-commit Checklist
- [ ] All tests pass locally
- [ ] Code follows project conventions
- [ ] New tests added for new features
- [ ] Documentation updated if needed
- [ ] No sensitive data in commits

## Branch Naming Conventions

### Feature Branches
- `feature/add-login-tests`
- `feature/update-user-management`
- `feature/mcp-integration-enhancement`

### Bugfix Branches
- `bugfix/fix-login-timeout`
- `bugfix/resolve-data-provider-issue`
- `bugfix/correct-allure-reporting`

### Release Branches
- `release/v1.0.0`
- `release/v1.1.0`

## Commit Message Format
```
type(scope): description

Examples:
feat(tests): add new campaign management tests
fix(utils): resolve Excel data reading issue
docs(readme): update installation instructions
test(rbl): add user lockout validation tests
```

## Conflict Resolution

### If you encounter merge conflicts:
```bash
# 1. Pull latest develop
git checkout develop
git pull origin develop

# 2. Rebase your feature branch
git checkout feature/your-feature
git rebase develop

# 3. Resolve conflicts in your editor
# ... fix conflicts ...

# 4. Continue rebase
git add .
git rebase --continue

# 5. Force push (only for feature branches)
git push --force-with-lease origin feature/your-feature
```

## Communication Guidelines

1. **Always create PRs** - Never push directly to master or develop
2. **Review each other's code** - At least one approval required
3. **Use descriptive commit messages** - Help others understand changes
4. **Test before pushing** - Run tests locally first
5. **Keep PRs small** - Easier to review and merge
6. **Update documentation** - Keep guides and README current

## Useful Git Commands

```bash
# Check current branch and status
git status
git branch -a

# View commit history
git log --oneline -10

# Stash changes temporarily
git stash
git stash pop

# View differences
git diff
git diff --staged

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View remote repositories
git remote -v
```

## Emergency Procedures

### If master gets broken:
1. Create hotfix branch from master
2. Fix the critical issue
3. Create PR to master with urgent review
4. After merge, update develop with the fix

### If you accidentally commit to master:
1. Don't panic!
2. Create a new branch from that commit
3. Reset master to previous state
4. Create PR from the new branch

## Contact Information
- Repository Owner: [Your Name/Email]
- Collaborators: [List team members]
- Project Documentation: [Link to additional docs]
