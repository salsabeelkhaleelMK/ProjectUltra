#!/bin/bash

# This script checks if CodeArtifact authentication is needed
# It runs before npm install but won't fail if authentication isn't possible

cd "$(dirname "$0")/.." || exit 0

# If .npmrc exists and has a valid token, skip
if [ -f .npmrc ] && grep -q "_authToken=" .npmrc 2>/dev/null; then
  # Check if token is still valid (not expired placeholder)
  if ! grep -q "\${CODEARTIFACT_AUTH_TOKEN}" .npmrc 2>/dev/null; then
    echo "✅ CodeArtifact authentication already configured"
    exit 0
  fi
fi

# Try to authenticate if AWS CLI is available
if command -v aws &> /dev/null && aws sts get-caller-identity &> /dev/null 2>/dev/null; then
  echo "🔑 Setting up CodeArtifact authentication..."
  bash scripts/setup.sh || {
    echo "⚠️  Could not authenticate automatically. Run 'npm run setup' manually."
    exit 0  # Don't fail install, just warn
  }
else
  echo "ℹ️  Run 'npm run setup' to configure CodeArtifact authentication"
  exit 0  # Don't fail install for public packages
fi


