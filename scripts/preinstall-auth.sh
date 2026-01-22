#!/bin/bash
# Preinstall hook: Attempts to authenticate with CodeArtifact if .npmrc doesn't exist
# This script won't fail npm install if AWS CLI isn't available or credentials aren't configured

# Check if .npmrc already exists
if [ -f .npmrc ]; then
  echo "✅ .npmrc file found, skipping authentication"
  exit 0
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "⚠️  AWS CLI not found. Run 'npm run setup' first to configure authentication."
  exit 0  # Don't fail npm install
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
  echo "⚠️  AWS credentials not configured. Run 'npm run setup' first."
  exit 0  # Don't fail npm install
fi

# Try to authenticate
echo "🔑 Attempting CodeArtifact authentication..."
if bash scripts/setup.sh 2>/dev/null; then
  echo "✅ CodeArtifact authentication successful!"
  exit 0
else
  echo "⚠️  Authentication failed. Run 'npm run setup' manually."
  exit 0  # Don't fail npm install
fi
