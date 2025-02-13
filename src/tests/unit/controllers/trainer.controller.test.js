const trainerController = require('../../../controllers/trainer.controller');
const trainerService = require('../../../services/trainer.service');

jest.mock('../../../services/trainer.service');

describe('Trainer Controller Test', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            user: {
                username: 'testuser'
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('create', () => {
        const mockTrainerData = {
            trainerName: 'Ash Ketchum',
            imgUrl: 'https://example.com/ash.png'
        };

        it('should create trainer successfully', async () => {
            mockReq.body = mockTrainerData;
            const createdTrainer = { ...mockTrainerData, username: mockReq.user.username };
            trainerService.create.mockResolvedValue(createdTrainer);

            await trainerController.create(mockReq, mockRes);

            expect(trainerService.create).toHaveBeenCalledWith({
                ...mockTrainerData,
                username: mockReq.user.username
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ data: createdTrainer });
        });

        it('should handle creation errors', async () => {
            mockReq.body = mockTrainerData;
            const error = new Error('Creation failed');
            trainerService.create.mockRejectedValue(error);

            await trainerController.create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('get', () => {
        const mockTrainer = {
            username: 'testuser',
            trainerName: 'Ash Ketchum',
            imgUrl: 'https://example.com/ash.png'
        };

        it('should get trainer successfully', async () => {
            trainerService.getByUsername.mockResolvedValue(mockTrainer);

            await trainerController.get(mockReq, mockRes);

            expect(trainerService.getByUsername).toHaveBeenCalledWith(mockReq.user.username);
            expect(mockRes.json).toHaveBeenCalledWith({ data: mockTrainer });
        });

        it('should handle get errors', async () => {
            const error = new Error('Trainer not found');
            trainerService.getByUsername.mockRejectedValue(error);

            await trainerController.get(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('update', () => {
        const updateData = {
            trainerName: 'Gary Oak',
            imgUrl: 'https://example.com/gary.png'
        };

        it('should update trainer successfully', async () => {
            mockReq.body = updateData;
            const updatedTrainer = { ...updateData, username: mockReq.user.username };
            trainerService.update.mockResolvedValue(updatedTrainer);

            await trainerController.update(mockReq, mockRes);

            expect(trainerService.update).toHaveBeenCalledWith(
                mockReq.user.username,
                updateData
            );
            expect(mockRes.json).toHaveBeenCalledWith({ data: updatedTrainer });
        });

        it('should handle update errors', async () => {
            mockReq.body = updateData;
            const error = new Error('Update failed');
            trainerService.update.mockRejectedValue(error);

            await trainerController.update(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('delete', () => {
        it('should delete trainer successfully', async () => {
            trainerService.delete.mockResolvedValue({});

            await trainerController.delete(mockReq, mockRes);

            expect(trainerService.delete).toHaveBeenCalledWith(mockReq.user.username);
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should handle deletion errors', async () => {
            const error = new Error('Deletion failed');
            trainerService.delete.mockRejectedValue(error);

            await trainerController.delete(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('markPokemon', () => {
        const markData = {
            pokemonId: 'pokemon123',
            isCaptured: true
        };

        it('should mark pokemon successfully', async () => {
            mockReq.body = markData;
            const updatedTrainer = {
                username: mockReq.user.username,
                pkmnCatch: ['pokemon123']
            };
            trainerService.markPokemon.mockResolvedValue(updatedTrainer);

            await trainerController.markPokemon(mockReq, mockRes);

            expect(trainerService.markPokemon).toHaveBeenCalledWith(
                mockReq.user.username,
                markData.pokemonId,
                markData.isCaptured
            );
            expect(mockRes.json).toHaveBeenCalledWith({ data: updatedTrainer });
        });

        it('should handle marking errors', async () => {
            mockReq.body = markData;
            const error = new Error('Marking failed');
            trainerService.markPokemon.mockRejectedValue(error);

            await trainerController.markPokemon(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
        });

        it('should mark pokemon as seen', async () => {
            mockReq.body = { ...markData, isCaptured: false };
            const updatedTrainer = {
                username: mockReq.user.username,
                pkmnSeen: ['pokemon123']
            };
            trainerService.markPokemon.mockResolvedValue(updatedTrainer);

            await trainerController.markPokemon(mockReq, mockRes);

            expect(trainerService.markPokemon).toHaveBeenCalledWith(
                mockReq.user.username,
                markData.pokemonId,
                false
            );
            expect(mockRes.json).toHaveBeenCalledWith({ data: updatedTrainer });
        });
    });
});