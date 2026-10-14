const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost', port: 3000,
      path: path, method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  // Login first
  const login = await request('POST', '/api/auth/login', JSON.stringify({ email: 'nithishmr@gmail.com', password: 'Admin@123' }));
  console.log('LOGIN:', login.status);
  if (login.status !== 200) {
    // Try common test credentials
    const login2 = await request('POST', '/api/auth/login', JSON.stringify({ email: 'admin@canteenly.com', password: 'Admin@123' }));
    console.log('LOGIN2:', login2.status, JSON.stringify(login2.data).substring(0,200));
    const login3 = await request('POST', '/api/auth/login', JSON.stringify({ email: 'admin@canteenly.com', password: 'admin123' }));
    console.log('LOGIN3:', login3.status, JSON.stringify(login3.data).substring(0,200));
    return;
  }
  
  const token = login.data.accessToken || login.data.token;
  console.log('Token received');

  // Get POS menu
  const menu = await request('GET', '/api/pos/menu', null, token);
  console.log('MENU status:', menu.status);
  if (Array.isArray(menu.data)) {
    console.log('Categories:', menu.data.length);
    menu.data.forEach(c => {
      console.log(`  ${c.name}: items=${c.items?.length || 0}, sortOrder=${c.sortOrder}`);
      if (c.items && c.items.length > 0) {
        c.items.forEach(item => {
          console.log(`    - ${item.name}: price=${item.price}, available=${item.isAvailable}, veg=${item.veg}, variants=${item.variants?.length || 0}`);
        });
      }
    });
  } else {
    console.log('Response:', JSON.stringify(menu.data).substring(0,500));
  }
})().catch(console.error);