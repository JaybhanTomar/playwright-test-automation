# Git Commit Process Guide

## Overview

This guide covers the complete Git workflow for committing code locally and pushing to GitHub repositories. It includes best practices, common commands, and troubleshooting tips.

## Prerequisites

- Git installed on your system
- GitHub account
- Repository initialized or cloned

## Basic Git Workflow

### 1. Check Repository Status

Always start by checking what files have changed:

```bash
git status
```

**Output Examples:**
- `nothing to commit, working tree clean` - No changes
- `modified: filename.js` - File has been modified
- `Untracked files:` - New files not yet tracked by Git

### 2. Stage Files for Commit

Add files to the staging area before committing:

```bash
# Add specific file
git add filename.js

# Add all files in current directory
git add .

# Add all JavaScript files
git add *.js

# Add specific directory
git add tests/pages/

# Add multiple specific files
git add file1.js file2.js file3.js
```

### 3. Commit Changes Locally

Create a commit with your staged changes:

```bash
# Simple commit with message
git commit -m "Your commit message here"

# Detailed commit with title and description
git commit -m "feat: Add new feature

- Added functionality X
- Fixed bug Y  
- Updated documentation"

# Commit all tracked files (skip staging)
git commit -am "Quick commit message"
```

## Commit Message Best Practices

### Conventional Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples:

```bash
# Feature addition
git commit -m "feat: Add conditional mapping logic to ImportPage"

# Bug fix
git commit -m "fix: Resolve timeout issue in selectExistingMapping method"

# Documentation
git commit -m "docs: Update README with setup instructions"

# Multiple changes
git commit -m "feat: Enhance ImportPage with conditional mapping

- Add existingMappingApplied parameter to verifyHeadersAndSetMappings
- Update selectExistingMapping to return boolean status
- Skip manual mapping when existing mapping is applied
- Add error handling for UI interaction issues"
```

## Viewing Commit History

```bash
# View recent commits (one line each)
git log --oneline

# View last 5 commits
git log --oneline -5

# View detailed commit information
git log

# View commits with file changes
git log --stat

# View commits for specific file
git log -- filename.js
```

## Undoing Changes

### Before Committing:

```bash
# Unstage file (keep changes)
git reset filename.js

# Discard changes in working directory
git checkout -- filename.js

# Discard all uncommitted changes
git reset --hard HEAD
```

### After Committing:

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit message
git commit --amend -m "New commit message"
```

## Pushing to GitHub

### Initial Setup

```bash
# Configure Git (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Or configure for current repository only
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add remote repository
git remote add origin https://github.com/username/repository-name.git

# Verify remote
git remote -v
```

### Push Commands

```bash
# Push to main/master branch (first time)
git push -u origin main
# or
git push -u origin master

# Push subsequent commits
git push

# Push specific branch
git push origin branch-name

# Force push (use with caution)
git push --force
```

## GitHub Authentication

### Option 1: Personal Access Token (Recommended)

1. **Create Token:**
   - Go to GitHub.com → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token → Select "repo" scope
   - Copy the token (starts with `ghp_`)

2. **Use Token:**
   ```bash
   git push -u origin main
   # Username: your-github-username
   # Password: [paste your token here]
   ```

### Option 2: SSH Keys

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. **Add to SSH Agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Add to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys
   - Add new SSH key

4. **Use SSH URL:**
   ```bash
   git remote set-url origin git@github.com:username/repository-name.git
   ```

## Common Scenarios

### Scenario 1: First Time Commit

```bash
# Initialize repository
git init

# Add files
git add .

# First commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/username/repo.git

# Push
git push -u origin main
```

### Scenario 2: Daily Development

```bash
# Check status
git status

# Add modified files
git add .

# Commit with message
git commit -m "feat: Add new feature"

# Push to GitHub
git push
```

### Scenario 3: Working with Existing Repository

```bash
# Clone repository
git clone https://github.com/username/repo.git

# Make changes
# ... edit files ...

# Add and commit
git add .
git commit -m "fix: Update functionality"

# Push changes
git push
```

## Troubleshooting Common Issues

### Issue 1: "Authentication failed"

**Problem:** GitHub no longer accepts password authentication

**Solution:** Use Personal Access Token or SSH keys (see Authentication section above)

### Issue 2: "Repository not found"

**Problem:** Incorrect repository URL or no access

**Solutions:**
```bash
# Check remote URL
git remote -v

# Update remote URL
git remote set-url origin https://github.com/correct-username/correct-repo.git

# Verify access to repository on GitHub
```

### Issue 3: "Your branch is behind"

**Problem:** Remote repository has newer commits

**Solutions:**
```bash
# Pull latest changes first
git pull origin main

# Then push your changes
git push
```

### Issue 4: "Merge conflicts"

**Problem:** Conflicting changes in same file

**Solutions:**
```bash
# Pull and resolve conflicts
git pull origin main

# Edit conflicted files (look for <<<<<<< markers)
# After resolving conflicts:
git add .
git commit -m "Resolve merge conflicts"
git push
```

### Issue 5: "Nothing to commit"

**Problem:** No changes staged

**Solutions:**
```bash
# Check what files changed
git status

# Add files to staging
git add filename.js
# or
git add .

# Then commit
git commit -m "Your message"
```

## Advanced Git Commands

### Branching

```bash
# Create new branch
git branch feature-branch

# Switch to branch
git checkout feature-branch

# Create and switch in one command
git checkout -b feature-branch

# List branches
git branch

# Merge branch
git checkout main
git merge feature-branch

# Delete branch
git branch -d feature-branch
```

### Stashing Changes

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Viewing Differences

```bash
# See changes in working directory
git diff

# See staged changes
git diff --staged

# Compare branches
git diff main..feature-branch

# See changes in specific file
git diff filename.js
```

## Best Practices

1. **Commit Often:** Make small, focused commits
2. **Write Clear Messages:** Use descriptive commit messages
3. **Review Before Committing:** Use `git status` and `git diff`
4. **Pull Before Pushing:** Always pull latest changes first
5. **Use Branches:** Create feature branches for new work
6. **Test Before Committing:** Ensure code works before committing

## Quick Reference

```bash
# Essential commands
git status          # Check repository status
git add .           # Stage all changes
git commit -m "msg" # Commit with message
git push            # Push to remote
git pull            # Pull from remote
git log --oneline   # View commit history

# Setup commands (one-time)
git config --global user.name "Name"
git config --global user.email "email"
git remote add origin <url>
```
