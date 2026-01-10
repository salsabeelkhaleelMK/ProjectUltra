#!/bin/bash
set -e

echo "=== Starting CodeArtifact Authentication ==="

# Map Netlify environment variables to AWS CLI expected names
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_MK:-$AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_MK:-$AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-eu-west-1}

# Verify AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "ERROR: AWS credentials not found!"
  echo "Please set AWS_ACCESS_KEY_ID_MK and AWS_SECRET_ACCESS_KEY_MK in Netlify environment variables"
  exit 1
fi

echo "AWS credentials found (access key: ${AWS_ACCESS_KEY_ID:0:4}...)"

# Remove any existing .npmrc files to avoid conflicts with stale tokens
# Check project root
if [ -f .npmrc ]; then
  echo "Removing existing .npmrc file in project root..."
  rm -f .npmrc
fi

# Check home directory (Netlify might cache it there)
if [ -f ~/.npmrc ]; then
  echo "Removing existing .npmrc file in home directory..."
  rm -f ~/.npmrc
fi

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1
echo "Working directory: $(pwd)"

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  curl -sSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
  # Add AWS CLI to PATH
  export PATH="/usr/local/bin:$PATH"
fi

echo "AWS CLI version: $(aws --version)"

# Authenticate with CodeArtifact
echo "Authenticating with AWS CodeArtifact..."
aws codeartifact login --tool npm \
  --repository ui-component-library \
  --domain motork \
  --domain-owner 678121811175 \
  --region eu-west-1

# Verify .npmrc was created
if [ ! -f .npmrc ]; then
  echo "ERROR: .npmrc file was not created!"
  exit 1
fi

echo "CodeArtifact authentication successful!"
echo ".npmrc file created/updated"
cat .npmrc | sed 's/:_authToken=.*/:_authToken=***REDACTED***/'

