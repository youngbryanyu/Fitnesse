import { getRateLimitCreateUser } from '../../../../src/features/user/rateLimit/userRateLimit';

describe('User Rate Limit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRateLimitCreateUser', () => {
    it('should create a rate limiter', async () => {
      const result = getRateLimitCreateUser();
      expect(typeof result).toBe('function');
    });
  });
});
