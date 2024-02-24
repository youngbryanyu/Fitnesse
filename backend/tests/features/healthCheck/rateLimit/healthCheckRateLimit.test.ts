import { getRateLimitHealthCheck } from '../../../../src/features/healthCheck/rateLimit/healthCheckRateLimit';

describe('Health Check Rate Limit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRateLimitHealthCheck', () => {
    it('should create a rate limiter', async () => {
      const result = getRateLimitHealthCheck();
      expect(typeof result).toBe('function');
    });
  });
});
