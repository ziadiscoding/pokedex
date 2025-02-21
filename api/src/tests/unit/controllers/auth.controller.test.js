const authController = require('../../../controllers/auth.controller');
const authService = require('../../../services/auth.service');

jest.mock('../../../services/auth.service');

describe('Auth Controller Test', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            user: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe('register', () => {
        const validRegisterData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            mockReq.body = validRegisterData;
            const mockUser = {
                _id: 'userId',
                ...validRegisterData,
                role: 'USER'
            };
            authService.register.mockResolvedValue({ 
                user: mockUser, 
                token: 'token123' 
            });

            await authController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                data: {
                    user: {
                        id: mockUser._id,
                        username: mockUser.username,
                        email: mockUser.email,
                        role: mockUser.role
                    },
                    token: 'token123'
                }
            });
        });

        it('should return 400 when required fields are missing', async () => {
            mockReq.body = { username: 'testuser' };

            await authController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'All fields are required'
            });
        });

        it('should handle service errors', async () => {
            mockReq.body = validRegisterData;
            const error = new Error('Registration failed');
            authService.register.mockRejectedValue(error);

            await authController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message
            });
        });
    });

    describe('login', () => {
        const validLoginData = {
            username: 'testuser',
            password: 'password123'
        };

        it('should login user successfully', async () => {
            mockReq.body = validLoginData;
            const mockUser = {
                _id: 'userId',
                username: validLoginData.username,
                email: 'test@example.com',
                role: 'USER'
            };
            authService.login.mockResolvedValue({ 
                user: mockUser, 
                token: 'token123' 
            });

            await authController.login(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Login successful',
                data: {
                    user: {
                        id: mockUser._id,
                        username: mockUser.username,
                        email: mockUser.email,
                        role: mockUser.role
                    },
                    token: 'token123'
                }
            });
        });

        it('should return 400 when required fields are missing', async () => {
            mockReq.body = { username: 'testuser' };

            await authController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Username and password are required'
            });
        });

        it('should handle authentication errors', async () => {
            mockReq.body = validLoginData;
            const error = new Error('Invalid credentials');
            authService.login.mockRejectedValue(error);

            await authController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message
            });
        });
    });

    describe('checkUser', () => {
        it('should return user data', async () => {
            mockReq.user = {
                _id: 'userId',
                username: 'testuser',
                email: 'test@example.com',
                role: 'USER'
            };

            await authController.checkUser(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                data: {
                    user: {
                        id: mockReq.user._id,
                        username: mockReq.user.username,
                        email: mockReq.user.email,
                        role: mockReq.user.role
                    }
                }
            });
        });
    });
});