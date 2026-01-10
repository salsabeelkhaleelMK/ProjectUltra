#!/bin/bash
set -e

# Map Netlify environment variables to AWS CLI expected names
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_MK:-$AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_MK:-$AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-eu-west-1}

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  curl -sSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
fi

# Authenticate with CodeArtifact
echo "Authenticating with AWS CodeArtifact..."
aws codeartifact login --tool npm \
  --repository ui-component-library \
  --domain motork \
  --domain-owner 678121811175 \
  --region eu-west-1

echo "CodeArtifact authentication successful!"

