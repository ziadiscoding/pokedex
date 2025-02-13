const pokemonController = require('../../../controllers/pokemon.controller');
const pokemonService = require('../../../services/pokemon.service');

jest.mock('../../../services/pokemon.service');

describe('Pokemon Controller Test', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            query: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe('create', () => {
        const mockPokemon = {
            name: 'Pikachu',
            types: ['ELECTRIC'],
            description: 'Electric mouse Pokemon',
            imgUrl: 'https://example.com/pikachu.png'
        };

        it('should create pokemon successfully', async () => {
            mockReq.body = mockPokemon;
            pokemonService.create.mockResolvedValue(mockPokemon);

            await pokemonController.create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ data: mockPokemon });
        });

        it('should handle creation errors', async () => {
            mockReq.body = mockPokemon;
            const error = new Error('Creation failed');
            pokemonService.create.mockRejectedValue(error);

            await pokemonController.create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });

    describe('addRegion', () => {
        const mockRegion = {
            regionName: 'Kanto',
            regionPokedexNumber: 25
        };

        it('should add region successfully', async () => {
            mockReq.query = { pkmnId: 'pokemon123' };
            mockReq.body = mockRegion;
            const updatedPokemon = { 
                ...mockRegion, 
                regions: [mockRegion] 
            };
            pokemonService.addRegion.mockResolvedValue(updatedPokemon);

            await pokemonController.addRegion(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ 
                data: updatedPokemon 
            });
        });

        it('should handle region addition errors', async () => {
            mockReq.query = { pkmnId: 'pokemon123' };
            mockReq.body = mockRegion;
            const error = new Error('Region addition failed');
            pokemonService.addRegion.mockRejectedValue(error);

            await pokemonController.addRegion(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });

    describe('search', () => {
        const mockSearchResult = {
            data: [{ name: 'Pikachu' }],
            count: 1,
            page: 1,
            totalPages: 1
        };

        it('should search pokemon successfully', async () => {
            mockReq.query = { 
                page: 1, 
                size: 10, 
                partialName: 'pika' 
            };
            pokemonService.search.mockResolvedValue(mockSearchResult);

            await pokemonController.search(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockSearchResult);
        });

        it('should handle search errors', async () => {
            mockReq.query = { partialName: 'pika' };
            const error = new Error('Search failed');
            pokemonService.search.mockRejectedValue(error);

            await pokemonController.search(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });

    describe('getOne', () => {
        const mockPokemon = {
            _id: 'pokemon123',
            name: 'Pikachu'
        };

        it('should get pokemon by id', async () => {
            mockReq.query = { id: 'pokemon123' };
            pokemonService.getById.mockResolvedValue(mockPokemon);

            await pokemonController.getOne(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ 
                data: mockPokemon 
            });
        });

        it('should get pokemon by name', async () => {
            mockReq.query = { name: 'Pikachu' };
            pokemonService.getByName.mockResolvedValue(mockPokemon);

            await pokemonController.getOne(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ 
                data: mockPokemon 
            });
        });

        it('should return 400 when no id or name provided', async () => {
            mockReq.query = {};

            await pokemonController.getOne(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: 'ID or name is required' 
            });
        });
    });

    describe('update', () => {
        const mockUpdate = {
            name: 'Raichu',
            types: ['ELECTRIC']
        };

        it('should update pokemon successfully', async () => {
            mockReq.query = { id: 'pokemon123' };
            mockReq.body = mockUpdate;
            pokemonService.update.mockResolvedValue(mockUpdate);

            await pokemonController.update(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ 
                data: mockUpdate 
            });
        });

        it('should handle update errors', async () => {
            mockReq.query = { id: 'pokemon123' };
            mockReq.body = mockUpdate;
            const error = new Error('Update failed');
            pokemonService.update.mockRejectedValue(error);

            await pokemonController.update(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });

    describe('delete', () => {
        it('should delete pokemon successfully', async () => {
            mockReq.query = { id: 'pokemon123' };
            pokemonService.delete.mockResolvedValue({});

            await pokemonController.delete(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should handle deletion errors', async () => {
            mockReq.query = { id: 'pokemon123' };
            const error = new Error('Deletion failed');
            pokemonService.delete.mockRejectedValue(error);

            await pokemonController.delete(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });

    describe('removeRegion', () => {
        it('should remove region successfully', async () => {
            mockReq.query = { 
                pkmnId: 'pokemon123', 
                regionName: 'Kanto' 
            };
            pokemonService.removeRegion.mockResolvedValue({});

            await pokemonController.removeRegion(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should handle region removal errors', async () => {
            mockReq.query = { 
                pkmnId: 'pokemon123', 
                regionName: 'Kanto' 
            };
            const error = new Error('Region removal failed');
            pokemonService.removeRegion.mockRejectedValue(error);

            await pokemonController.removeRegion(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: error.message 
            });
        });
    });
});