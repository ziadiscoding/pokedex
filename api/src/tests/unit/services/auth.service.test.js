const authService = require('../../../services/auth.service');
const { User } = require('../../../models/user.model');
const jwt = require('jsonwebtoken');

describe('Auth Service Test', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('register', () => {
    it('should register a new user', async () => {
      const { user, token } = await authService.register(
        testUser.username,
        testUser.email,
        testUser.password
      );

      expect(user.username).toBe(testUser.username);
      expect(user.email).toBe(testUser.email);
      expect(user.password).not.toBe(testUser.password);
      expect(token).toBeDefined();
    });

    it('should not register duplicate username', async () => {
      await authService.register(testUser.username, testUser.email, testUser.password);

      await expect(
        authService.register(testUser.username, 'other@example.com', testUser.password)
      ).rejects.toThrow('Username or email already exists');
    });

    it('should not register duplicate email', async () => {
      await authService.register(testUser.username, testUser.email, testUser.password);

      await expect(
        authService.register('otheruser', testUser.email, testUser.password)
      ).rejects.toThrow('Username or email already exists');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register(testUser.username, testUser.email, testUser.password);
    });

    it('should login with correct credentials', async () => {
      const { user, token } = await authService.login(testUser.username, testUser.password);

      expect(user.username).toBe(testUser.username);
      expect(token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      await expect(
        authService.login(testUser.username, 'wrongpassword')
      ).rejects.toThrow('Invalid password');
    });

    it('should not login with non-existent username', async () => {
      await expect(
        authService.login('nonexistent', testUser.password)
      ).rejects.toThrow('User not found');
    });
  });
});