#!/bin/bash
set -e

echo "=== Pre-build: AWS CodeArtifact Authentication ==="

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

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  curl -sSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
  export PATH="/usr/local/bin:$PATH"
fi

echo "AWS CLI version: $(aws --version)"

# Get CodeArtifact authorization token
echo "Getting CodeArtifact authorization token..."
AUTH_TOKEN=$(aws codeartifact get-authorization-token \
  --domain motork \
  --domain-owner 678121811175 \
  --region eu-west-1 \
  --query authorizationToken \
  --output text)

if [ -z "$AUTH_TOKEN" ]; then
  echo "ERROR: Failed to get CodeArtifact authorization token"
  exit 1
fi

echo "Authorization token obtained (length: ${#AUTH_TOKEN})"

# Create .npmrc file with the token
cat > .npmrc << EOF
registry=https://motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:always-auth=true
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:_authToken=${AUTH_TOKEN}
EOF

echo ".npmrc file created successfully"
echo "CodeArtifact authentication complete!"



