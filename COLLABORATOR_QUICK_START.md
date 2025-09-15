# Quick Start Guide for Collaborators

## 🚀 Getting Started (5 minutes)

### Option 1: Automated Setup (Recommended)
```bash
# 1. Clone and run setup script
git clone https://github.com/JaybhanTomar/playwright-test-automation.git
cd playwright-test-automation
./setup-collaborator.sh
```

### Option 2: Manual Setup
```bash
# 1. Clone repository
git clone https://github.com/JaybhanTomar/playwright-test-automation.git
cd playwright-test-automation

# 2. Switch to develop branch
git checkout develop

# 3. Install dependencies
npm install
npx playwright install

# 4. Create your feature branch
git checkout -b feature/your-feature-name
```

## 📋 Daily Workflow

### Starting Work
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-task-name
```

### Making Changes
```bash
# Make your changes...
git add .
git commit -m "feat: describe your changes"
git push -u origin feature/your-task-name
```

### Creating Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base branch to `develop`
4. Add description and request review
5. Wait for approval and merge

## 🧪 Testing Commands

```bash
# Run all tests
npm run test

# Run specific test suite
npx playwright test tests/Sanity/

# Run with UI
npx playwright test --ui

# Generate reports
npm run allure:generate
npm run allure:open
```

## 🌿 Branch Rules

- **`master`** - Production code (protected, no direct pushes)
- **`develop`** - Integration branch (create PRs here)
- **`feature/*`** - Your feature branches
- **`bugfix/*`** - Bug fix branches

## 📞 Need Help?

1. Check `COLLABORATION_GUIDE.md` for detailed instructions
2. Review existing tests in `tests/` directory
3. Ask team members for code review
4. Check GitHub Issues for known problems

## ⚡ Quick Commands Reference

```bash
# Branch management
git checkout develop              # Switch to develop
git pull origin develop          # Get latest changes
git checkout -b feature/name     # Create feature branch
git push -u origin feature/name  # Push feature branch

# Testing
npm run test                     # Run all tests
npx playwright test --headed     # Run with browser visible
npx playwright test --debug      # Debug mode

# Reporting
npm run allure:generate          # Generate Allure report
npm run allure:open             # Open Allure report
```

## 🚨 Important Rules

1. **Never push directly to `master`**
2. **Always create PRs to `develop`**
3. **Test your changes locally first**
4. **Use descriptive commit messages**
5. **Keep PRs small and focused**

---

**Ready to contribute? Create your first feature branch and start coding!** 🎉
