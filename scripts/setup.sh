#!/bin/bash
set -e

echo "=== ProjectUltra Setup ==="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "⚠️  AWS CLI is not installed."
  echo ""
  echo "To install AWS CLI:"
  echo "  macOS:   brew install awscli"
  echo "  Linux:   See https://aws.amazon.com/cli/"
  echo "  Windows: See https://aws.amazon.com/cli/"
  echo ""
  echo "After installing, configure with: aws configure"
  echo ""
  exit 1
fi

echo "✅ AWS CLI found: $(aws --version)"
echo ""

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
  echo "⚠️  AWS credentials not configured."
  echo ""
  echo "Please configure AWS credentials using one of these methods:"
  echo ""
  echo "1. AWS CLI:"
  echo "   aws configure"
  echo ""
  echo "2. Environment variables:"
  echo "   export AWS_ACCESS_KEY_ID=your-key"
  echo "   export AWS_SECRET_ACCESS_KEY=your-secret"
  echo "   export AWS_DEFAULT_REGION=eu-west-1"
  echo ""
  echo "3. For CI/CD (Netlify):"
  echo "   Set AWS_ACCESS_KEY_ID_MK and AWS_SECRET_ACCESS_KEY_MK"
  echo ""
  exit 1
fi

echo "✅ AWS credentials configured"
echo ""

# Navigate to project root
cd "$(dirname "$0")/.." || exit 1

# Get authorization token
echo "🔑 Authenticating with AWS CodeArtifact..."
AUTH_TOKEN=$(aws codeartifact get-authorization-token \
  --domain motork \
  --domain-owner 678121811175 \
  --region eu-west-1 \
  --query authorizationToken \
  --output text 2>/dev/null)

if [ -z "$AUTH_TOKEN" ]; then
  echo "❌ Failed to get CodeArtifact authorization token"
  echo ""
  echo "Please ensure you have access to the CodeArtifact repository."
  echo "Contact your administrator if you need access."
  exit 1
fi

# Write .npmrc file
cat > .npmrc << EOF
registry=https://motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:always-auth=true
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:_authToken=${AUTH_TOKEN}
EOF

echo "✅ CodeArtifact authentication successful!"
echo "✅ .npmrc file created"
echo ""
echo "You can now run: npm install"
echo ""


