const request = require('supertest');
const app = require('../../../server');
const { User } = require('../../../models/user.model');

describe('Auth Routes Test', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201);

            expect(response.body.data.user.username).toBe(testUser.username);
            expect(response.body.data.token).toBeDefined();
        });

        it('should not register duplicate username', async () => {
            await request(app)
                .post('/api/auth/register')
                .send(testUser);

            await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(400);
        });

        it('should require all fields', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: testUser.username,
                    email: testUser.email
                })
                .expect(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('should login with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password
                })
                .expect(200);

            expect(response.body.data.token).toBeDefined();
        });

        it('should not login with incorrect password', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: 'wrongpassword'
                })
                .expect(401);
        });

        it('should not login with non-existent username', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'nonexistent',
                    password: testUser.password
                })
                .expect(401);
        });
    });

    describe('GET /api/auth/me', () => {
        let token;

        beforeEach(async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);
            token = response.body.data.token;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.data.user.username).toBe(testUser.username);
        });

        it('should not get profile without token', async () => {
            await request(app)
                .get('/api/auth/me')
                .expect(401);
        });

        it('should not get profile with invalid token', async () => {
            await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalidtoken')
                .expect(403);
        });
    });
});