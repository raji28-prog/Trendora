import buildApp from '../src/app.js';
import { jest } from '@jest/globals';
import AuthService from '../src/services/auth.service.js';

// Mock AuthService methods
jest.spyOn(AuthService, 'login').mockImplementation(async ({ email, password }) => {
  if (email === 'test@example.com' && password === 'password123') {
    return { id: 'user-id-123', email: 'test@example.com', name: 'Test User', role: 'USER' };
  }
  const err = new Error('Invalid email or password');
  err.statusCode = 401;
  throw err;
});

jest.spyOn(AuthService, 'saveRefreshToken').mockImplementation(async () => {});

describe('Auth Endpoints', () => {
  let app;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('POST /api/auth/login with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('test@example.com');
    expect(body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/login with invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'wrong@example.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
