require('dotenv').config();
const axios = require('axios');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { initModels } = require('./db/models');
const { generateAccessToken } = require('./middleware/auth');

async function testSalesAPI() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'canteenly',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'CanteenLy2026',
    { host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false }
  );

  await sequelize.authenticate();
  const models = initModels(sequelize);
  const { User } = models;

  let user = await User.findOne({ where: { email: 'admin@test.com' } });
  if (!user) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    user = await User.create({ email: 'admin@test.com', passwordHash, name: 'Test Admin', role: 'admin' });
  }

  const token = generateAccessToken(user);
  const headers = { 'Authorization': `Bearer ${token}` };
  const api = axios.create({ baseURL: 'http://localhost:3000/api', headers });

  console.log('\n=== Test 1: All Records ===');
  let res = await api.get('/admin/dashboard/sales');
  console.log(`Total records: ${res.data.dailySales.length}`);
  res.data.dailySales.forEach(d => console.log(`  ${d.date}: ${d.orderCount} orders, ₹${d.revenue}`));

  console.log('\n=== Test 2: Date Filter (2026-07-10 to 2026-07-15) ===');
  res = await api.get('/admin/dashboard/sales?from=2026-07-10&to=2026-07-15');
  console.log(`Filtered records: ${res.data.dailySales.length}`);
  res.data.dailySales.forEach(d => console.log(`  ${d.date}: ${d.orderCount} orders, ₹${d.revenue}`));

  console.log('\n=== Test 3: Date Filter (2026-07-14 to 2026-07-14) ===');
  res = await api.get('/admin/dashboard/sales?from=2026-07-14&to=2026-07-14');
  console.log(`Filtered records: ${res.data.dailySales.length}`);
  res.data.dailySales.forEach(d => console.log(`  ${d.date}: ${d.orderCount} orders, ₹${d.revenue}`));

  console.log('\n✅ All tests completed!');
  await sequelize.close();
}

testSalesAPI().catch(err => console.error('Error:', err.message));
