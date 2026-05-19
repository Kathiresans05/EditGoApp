const { execSync } = require('child_process');

console.log('Starting build status poller...');
let attempts = 0;

const checkStatus = () => {
  try {
    attempts++;
    const resStr = execSync('npx eas-cli build:view 75b71d7b-79e1-4064-b18d-cf101375a662 --json', { encoding: 'utf8' });
    const res = JSON.parse(resStr);
    console.log(`[${new Date().toISOString()}] Attempt ${attempts}: Status is ${res.status}`);
    
    if (res.status === 'FINISHED') {
      console.log('BUILD_SUCCESSFUL');
      console.log('ARTIFACT_DETAILS:', JSON.stringify(res.artifacts));
      process.exit(0);
    } else if (res.status === 'ERRORED') {
      console.log('BUILD_FAILED');
      console.log('ERROR_DETAILS:', JSON.stringify(res.error));
      process.exit(1);
    }
  } catch (e) {
    console.error('Error checking build status:', e.message);
  }
};

// Check immediately then every 10 seconds
checkStatus();
setInterval(checkStatus, 10000);
