#!/bin/bash

# Playwright Testing Framework - Collaborator Setup Script
# This script helps new collaborators set up their local development environment

echo "🚀 Setting up Playwright Testing Framework for collaboration..."
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Get current directory name
CURRENT_DIR=$(basename "$PWD")

# Check if we're already in the project directory
if [ "$CURRENT_DIR" = "playwright-demo-new" ] || [ -f "playwright.config.js" ]; then
    echo "📁 Already in project directory. Skipping clone..."
    PROJECT_DIR="$PWD"
else
    # Clone the repository
    echo "📥 Cloning repository..."
    REPO_URL="https://github.com/JaybhanTomar/playwright-test-automation.git"
    PROJECT_NAME="playwright-test-automation"
    
    if [ -d "$PROJECT_NAME" ]; then
        echo "⚠️  Directory $PROJECT_NAME already exists. Using existing directory..."
        cd "$PROJECT_NAME"
    else
        git clone "$REPO_URL"
        cd "$PROJECT_NAME"
    fi
    PROJECT_DIR="$PWD"
fi

echo "📂 Working in directory: $PROJECT_DIR"
echo ""

# Check current branch and switch to develop
echo "🌿 Setting up branches..."
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Fetch all branches
git fetch origin

# Check if develop branch exists locally
if git show-ref --verify --quiet refs/heads/develop; then
    echo "✅ Develop branch exists locally"
    git checkout develop
else
    echo "🔄 Creating local develop branch from origin/develop"
    git checkout -b develop origin/develop
fi

# Pull latest changes
echo "⬇️  Pulling latest changes from develop..."
git pull origin develop

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check your npm configuration."
    exit 1
fi

echo ""

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
if npx playwright install; then
    echo "✅ Playwright browsers installed successfully!"
else
    echo "❌ Failed to install Playwright browsers. Please run 'npx playwright install' manually."
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOL
# Environment Configuration
NODE_ENV=development

# Test Configuration
HEADLESS=true
TIMEOUT=30000

# Browser Configuration
BROWSER=chromium

# Reporting
ALLURE_RESULTS_DIR=allure-results
ALLURE_REPORT_DIR=allure-report

# Add your specific environment variables here
# EXAMPLE_API_URL=https://api.example.com
# EXAMPLE_USERNAME=testuser
# EXAMPLE_PASSWORD=testpass
EOL
    echo "✅ .env file created. Please update it with your specific configuration."
else
    echo "✅ .env file already exists."
fi

echo ""

# Run a quick test to verify setup
echo "🧪 Running setup verification test..."
if npx playwright test --reporter=list --max-failures=1 tests/Sanity/ 2>/dev/null; then
    echo "✅ Setup verification passed!"
else
    echo "⚠️  Setup verification had issues. This might be normal if tests require specific configuration."
    echo "   Please check the test configuration and data files."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo "1. Review the COLLABORATION_GUIDE.md file for workflow instructions"
echo "2. Update the .env file with your specific configuration"
echo "3. Create your first feature branch: git checkout -b feature/your-feature-name"
echo "4. Start developing and testing!"
echo ""
echo "🔧 Useful Commands:"
echo "   npm run test                 - Run all tests"
echo "   npx playwright test --ui     - Run tests with UI"
echo "   npm run allure:generate      - Generate Allure report"
echo "   git checkout -b feature/name - Create new feature branch"
echo ""
echo "📚 Documentation:"
echo "   - COLLABORATION_GUIDE.md     - Team workflow guide"
echo "   - README.md                  - Project documentation"
echo "   - playwright.config.js       - Test configuration"
echo ""
echo "Happy testing! 🚀"
