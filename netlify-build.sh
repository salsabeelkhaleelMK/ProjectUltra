#!/bin/bash
set -e

# Export AWS credentials from Netlify environment variables
# Netlify uses AWS_ACCESS_KEY_ID_MK and AWS_SECRET_ACCESS_KEY_MK
# but AWS CLI expects AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_MK
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_MK
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-eu-west-1}

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  curl -sSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
fi

# Run the build (npm install will run automatically before this via Netlify)
npm run build

