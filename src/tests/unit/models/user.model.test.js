const { User, ROLES } = require('../../../models/user.model');

describe('User Model Test', () => {
    const validUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    };

    it('should validate a valid user', async () => {
        const validUser = new User(validUserData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(validUserData.username);
        expect(savedUser.email).toBe(validUserData.email);
        expect(savedUser.role).toBe(ROLES.USER);
    });

    it('should fail validation without required username', async () => {
        const userWithoutUsername = new User({
            ...validUserData,
            username: undefined
        });

        await expect(userWithoutUsername.save()).rejects.toThrow();
    });

    it('should fail validation without required email', async () => {
        const userWithoutEmail = new User({
            ...validUserData,
            email: undefined
        });

        await expect(userWithoutEmail.save()).rejects.toThrow();
    });

    it('should fail validation without required password', async () => {
        const userWithoutPassword = new User({
            ...validUserData,
            password: undefined
        });

        await expect(userWithoutPassword.save()).rejects.toThrow();
    });

    it('should fail validation with invalid email format', async () => {
        const userWithInvalidEmail = new User({
            ...validUserData,
            email: 'invalid-email'
        });

        await expect(userWithInvalidEmail.save()).rejects.toThrow();
    });

    it('should fail validation with invalid role', async () => {
        const userWithInvalidRole = new User({
            ...validUserData,
            role: 'INVALID_ROLE'
        });

        await expect(userWithInvalidRole.save()).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
        const user = new User(validUserData);
        const savedUser = await user.save();

        expect(savedUser.password).not.toBe(validUserData.password);
        expect(savedUser.password).toHaveLength(60);
    });

    it('should correctly compare password', async () => {
        const user = new User(validUserData);
        await user.save();

        const isValidPassword = await user.comparePassword(validUserData.password);
        const isInvalidPassword = await user.comparePassword('wrongpassword');

        expect(isValidPassword).toBe(true);
        expect(isInvalidPassword).toBe(false);
    });

    it('should not hash password if not modified', async () => {
        const user = new User(validUserData);
        const savedUser = await user.save();
        const originalPassword = savedUser.password;

        savedUser.email = 'newemail@example.com';
        const updatedUser = await savedUser.save();

        expect(updatedUser.password).toBe(originalPassword);
    });
});