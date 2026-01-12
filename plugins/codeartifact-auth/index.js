// Netlify build plugin to authenticate with AWS CodeArtifact before npm install
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('=== AWS CodeArtifact Authentication Plugin ===');
    
    try {
      // Map Netlify environment variables to AWS CLI expected names
      const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID_MK || process.env.AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_MK || process.env.AWS_SECRET_ACCESS_KEY;
      const awsRegion = process.env.AWS_DEFAULT_REGION || 'eu-west-1';
      
      if (!awsAccessKeyId || !awsSecretAccessKey) {
        throw new Error('AWS credentials not found! Please set AWS_ACCESS_KEY_ID_MK and AWS_SECRET_ACCESS_KEY_MK in Netlify environment variables');
      }
      
      console.log(`AWS credentials found (access key: ${awsAccessKeyId.substring(0, 4)}...)`);
      
      // Set AWS credentials in environment
      process.env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
      process.env.AWS_DEFAULT_REGION = awsRegion;
      
      // Check if AWS CLI is installed
      try {
        const awsVersion = execSync('aws --version', { encoding: 'utf8' });
        console.log(`AWS CLI found: ${awsVersion.trim()}`);
      } catch (error) {
        console.log('AWS CLI not found, installing...');
        execSync('curl -sSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip', { stdio: 'inherit' });
        execSync('unzip -q /tmp/awscliv2.zip -d /tmp', { stdio: 'inherit' });
        execSync('/tmp/aws/install', { stdio: 'inherit' });
        // Update PATH
        process.env.PATH = `/usr/local/bin:${process.env.PATH}`;
        console.log('AWS CLI installed successfully');
      }
      
      // Get CodeArtifact authorization token
      console.log('Getting CodeArtifact authorization token...');
      const authToken = execSync(
        'aws codeartifact get-authorization-token --domain motork --domain-owner 678121811175 --region eu-west-1 --query authorizationToken --output text',
        { encoding: 'utf8' }
      ).trim();
      
      if (!authToken || authToken.length === 0) {
        throw new Error('Failed to get CodeArtifact authorization token');
      }
      
      console.log(`Authorization token obtained (length: ${authToken.length})`);
      
      // Create .npmrc file with the token
      const npmrcPath = path.join(process.cwd(), '.npmrc');
      const npmrcContent = `registry=https://motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:always-auth=true
//motork-678121811175.d.codeartifact.eu-west-1.amazonaws.com/npm/ui-component-library/:_authToken=${authToken}
`;
      
      fs.writeFileSync(npmrcPath, npmrcContent);
      console.log('.npmrc file created with authentication token');
      console.log('CodeArtifact authentication successful!');
      
    } catch (error) {
      console.error('CodeArtifact authentication failed:', error.message);
      utils.build.failBuild('Failed to authenticate with AWS CodeArtifact', { error });
    }
  }
};


