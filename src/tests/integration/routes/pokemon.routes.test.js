const request = require('supertest');
const app = require('../../../server');
const { User, ROLES } = require('../../../models/user.model');
const Pokemon = require('../../../models/pokemon.model');

describe('Pokemon Routes Test', () => {
  let adminToken;
  let userToken;
  let testAdmin;
  let testUser;

  beforeEach(async () => {
    // Créer un admin de test
    testAdmin = await User.create({
      username: 'testadmin',
      email: 'testadmin@test.com',
      password: 'password123',
      role: ROLES.ADMIN
    });

    // Créer un utilisateur normal de test
    testUser = await User.create({
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'password123',
      role: ROLES.USER
    });

    // Obtenir les tokens
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin', password: 'password123' });
    adminToken = adminResponse.body.data.token;

    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    userToken = userResponse.body.data.token;
  });

  describe('POST /api/pkmn', () => {
    const newPokemon = {
      name: 'Pikachu',
      types: ['ELECTRIC'],
      description: 'A cute electric mouse',
      imgUrl: 'https://example.com/pikachu.png'
    };

    it('should create pokemon when admin', async () => {
      const response = await request(app)
        .post('/api/pkmn')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newPokemon)
        .expect(201);

      expect(response.body.data.name).toBe(newPokemon.name);
    });

    it('should reject pokemon creation for normal users', async () => {
      await request(app)
        .post('/api/pkmn')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newPokemon)
        .expect(403);
    });
  });

  describe('GET /api/pkmn/search', () => {
    beforeEach(async () => {
      await Pokemon.create([
        {
          name: 'Charizard',
          types: ['FIRE', 'FLYING'],
          description: 'A dragon-like pokemon',
          imgUrl: 'https://example.com/charizard.png'
        },
        {
          name: 'Blastoise',
          types: ['WATER'],
          description: 'A water turtle pokemon',
          imgUrl: 'https://example.com/blastoise.png'
        }
      ]);
    });

    it('should search pokemon without authentication', async () => {
      const response = await request(app)
        .get('/api/pkmn/search')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    it('should filter pokemon by type', async () => {
      const response = await request(app)
        .get('/api/pkmn/search')
        .query({ typeOne: 'FIRE' })
        .expect(200);

      expect(response.body.data.every(p => p.types.includes('FIRE'))).toBeTruthy();
    });
  });
});