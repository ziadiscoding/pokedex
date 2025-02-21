const request = require('supertest');
const app = require('../../../server');
const { User } = require('../../../models/user.model');
const Pokemon = require('../../../models/pokemon.model');
const Trainer = require('../../../models/trainer.model');

describe('Trainer Routes Test', () => {
    let userToken;
    let userId;
    let testPokemon;

    const testTrainer = {
        trainerName: 'Ash Ketchum',
        imgUrl: 'https://example.com/ash.png'
    };

    beforeEach(async () => {
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        userToken = userResponse.body.data.token;
        userId = userResponse.body.data.user.id;

        testPokemon = await Pokemon.create({
            name: 'Pikachu',
            types: ['ELECTRIC'],
            description: 'Electric mouse Pokemon',
            imgUrl: 'https://example.com/pikachu.png'
        });
    });

    describe('POST /api/trainer', () => {
        it('should create a new trainer', async () => {
            const response = await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer)
                .expect(201);

            expect(response.body.data.trainerName).toBe(testTrainer.trainerName);
        });

        it('should not create duplicate trainer for user', async () => {
            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer);

            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer)
                .expect(400);
        });

        it('should require authentication', async () => {
            await request(app)
                .post('/api/trainer')
                .send(testTrainer)
                .expect(401);
        });
    });

    describe('GET /api/trainer', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer);
        });

        it('should get trainer profile', async () => {
            const response = await request(app)
                .get('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.data.trainerName).toBe(testTrainer.trainerName);
        });

        it('should require authentication', async () => {
            await request(app)
                .get('/api/trainer')
                .expect(401);
        });
    });

    describe('PUT /api/trainer', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer);
        });

        it('should update trainer profile', async () => {
            const updatedData = {
                trainerName: 'Gary Oak',
                imgUrl: 'https://example.com/gary.png'
            };

            const response = await request(app)
                .put('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.data.trainerName).toBe(updatedData.trainerName);
        });

        it('should require authentication', async () => {
            await request(app)
                .put('/api/trainer')
                .send({ trainerName: 'New Name' })
                .expect(401);
        });
    });

    describe('POST /api/trainer/mark', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer);
        });

        it('should mark pokemon as seen', async () => {
            const response = await request(app)
                .post('/api/trainer/mark')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    pokemonId: testPokemon._id.toString(),
                    isCaptured: false
                })
                .expect(200);

            const seenIds = response.body.data.pkmnSeen.map(id => id.toString());
            expect(seenIds).toContain(testPokemon._id.toString());
        });

        it('should mark pokemon as caught', async () => {
            const response = await request(app)
                .post('/api/trainer/mark')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    pokemonId: testPokemon._id.toString(),
                    isCaptured: true
                })
                .expect(200);

            const caughtIds = response.body.data.pkmnCatch.map(id => id.toString());
            expect(caughtIds).toContain(testPokemon._id.toString());
        });

        it('should move pokemon from seen to caught', async () => {
            await request(app)
                .post('/api/trainer/mark')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    pokemonId: testPokemon._id.toString(),
                    isCaptured: false
                });

            const response = await request(app)
                .post('/api/trainer/mark')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    pokemonId: testPokemon._id.toString(),
                    isCaptured: true
                })
                .expect(200);

            const caughtIds = response.body.data.pkmnCatch.map(id => id.toString());
            const seenIds = response.body.data.pkmnSeen.map(id => id.toString());

            expect(caughtIds).toContain(testPokemon._id.toString());
            expect(seenIds).not.toContain(testPokemon._id.toString());
        });
    });

    describe('DELETE /api/trainer', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testTrainer);
        });

        it('should delete trainer profile', async () => {
            await request(app)
                .delete('/api/trainer')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204);

            const trainer = await Trainer.findOne({ username: 'testuser' });
            expect(trainer).toBeNull();
        });

        it('should require authentication', async () => {
            await request(app)
                .delete('/api/trainer')
                .expect(401);
        });
    });
});