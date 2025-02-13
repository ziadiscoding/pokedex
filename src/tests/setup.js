const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User, ROLES } = require('../models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Helper pour créer des utilisateurs de test
global.createTestUser = async (role = ROLES.USER) => {
  const username = role === ROLES.ADMIN ? 'testadmin' : 'testuser';
  const user = new User({
    username,
    email: `${username}@test.com`,
    password: 'password123',
    role
  });
  await user.save();
  return user;
};