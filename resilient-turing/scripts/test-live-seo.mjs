import https from 'https';

function testEndpoint(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        console.log('--------------------------------------------------');
        console.log('Testing: ' + url);
        console.log('Status:  ' + res.statusCode);
        console.log('Length:  ' + data.length + ' bytes');
        
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        const canonicalMatch = data.match(/<link rel="canonical" href="(.*?)"/i);
        const h1Match = data.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const h2Matches = [...data.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);

        if (titleMatch) console.log('Title:     ' + titleMatch[1]);
        if (canonicalMatch) console.log('Canonical: ' + canonicalMatch[1]);
        if (h1Match) console.log('H1:        ' + h1Match[1]);
        if (h2Matches.length) console.log('H2s:       ' + h2Matches.join(' | '));
        resolve();
      });
    }).on('error', (e) => {
      console.error('Error on ' + url, e.message);
      resolve();
    });
  });
}

async function main() {
  await testEndpoint('https://hedabkh.com.sa/ar/team');
  await testEndpoint('https://hedabkh.com.sa/ar/equipment');
  await testEndpoint('https://hedabkh.com.sa/ar/about');
  await testEndpoint('https://hedabkh.com.sa/ar/services');
  await testEndpoint('https://hedabkh.com.sa/ar/projects');
}

main();
