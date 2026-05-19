const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const zlib = require('zlib');

try {
  console.log('Fetching active build metadata...');
  const metadataStr = execSync('npx eas-cli build:view 75b71d7b-79e1-4064-b18d-cf101375a662 --json', { encoding: 'utf8' });
  const metadata = JSON.parse(metadataStr);
  const logUrl = metadata.logFiles[0];
  console.log('Log URL:', logUrl);

  if (!logUrl) {
    console.log('No log URL available yet.');
    process.exit(0);
  }

  console.log('Fetching log content...');
  https.get(logUrl, (res) => {
    let chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentEncoding = res.headers['content-encoding'];
      console.log('Content-Encoding:', contentEncoding);
      
      let decoded;
      if (contentEncoding === 'br') {
        decoded = zlib.brotliDecompressSync(buffer).toString('utf8');
      } else if (contentEncoding === 'gzip') {
        decoded = zlib.gunzipSync(buffer).toString('utf8');
      } else if (contentEncoding === 'deflate') {
        decoded = zlib.inflateSync(buffer).toString('utf8');
      } else {
        try {
          decoded = zlib.brotliDecompressSync(buffer).toString('utf8');
        } catch (e) {
          try {
            decoded = zlib.gunzipSync(buffer).toString('utf8');
          } catch (e2) {
            decoded = buffer.toString('utf8');
          }
        }
      }

      fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\303360c3-6b4f-4ed7-8d78-d4617512b440\\active_build_log.txt', decoded);
      console.log('Successfully saved active build log!');
    });
  }).on('error', (err) => {
    console.error('HTTPS Get Error:', err);
  });
} catch (error) {
  console.error('Error occurred:', error);
}
