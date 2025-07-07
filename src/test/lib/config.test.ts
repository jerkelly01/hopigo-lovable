import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  config, 
  getConfigValue, 
  isFeatureEnabled, 
  getAppInfo,
  getSupabaseConfig,
  validateConfig 
} from '@/lib/config';

describe('Configuration Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('config object', () => {
    it('should have all required properties', () => {
      expect(config).toHaveProperty('app');
      expect(config).toHaveProperty('supabase');
      expect(config).toHaveProperty('api');
      expect(config).toHaveProperty('ui');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('uploads');
      expect(config).toHaveProperty('security');
    });

    it('should have valid default values', () => {
      expect(config.app.name).toBe('Admin Dashboard');
      expect(config.app.version).toBe('1.0.0');
      expect(config.supabase.url).toContain('supabase.co');
      expect(config.api.timeout).toBeGreaterThan(0);
      expect(config.uploads.maxFileSize).toBeGreaterThan(0);
    });
  });

  describe('getConfigValue', () => {
    it('should return nested config values', () => {
      expect(getConfigValue('app.name')).toBe('Admin Dashboard');
      expect(getConfigValue('ui.pagination.defaultPageSize')).toBe(10);
      expect(getConfigValue('features.enableAnalytics')).toBe(true);
    });

    it('should return undefined for non-existent paths', () => {
      expect(getConfigValue('nonexistent.path')).toBeUndefined();
      expect(getConfigValue('app.nonexistent')).toBeUndefined();
    });

    it('should return default value when path does not exist', () => {
      expect(getConfigValue('nonexistent.path', 'default')).toBe('default');
      expect(getConfigValue('app.nonexistent', 42)).toBe(42);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return correct feature flags', () => {
      expect(isFeatureEnabled('enableAnalytics')).toBe(true);
      expect(isFeatureEnabled('enableNotifications')).toBe(true);
      expect(isFeatureEnabled('enableFileUploads')).toBe(true);
    });
  });

  describe('getAppInfo', () => {
    it('should return app information', () => {
      const appInfo = getAppInfo();
      expect(appInfo).toEqual({
        name: 'Admin Dashboard',
        version: '1.0.0',
        environment: 'development',
        debug: true,
      });
    });
  });

  describe('getSupabaseConfig', () => {
    it('should return Supabase configuration', () => {
      const supabaseConfig = getSupabaseConfig();
      expect(supabaseConfig).toHaveProperty('url');
      expect(supabaseConfig).toHaveProperty('anonKey');
      expect(supabaseConfig).toHaveProperty('projectId');
      expect(supabaseConfig.url).toContain('supabase.co');
    });
  });

  describe('validateConfig', () => {
    it('should validate configuration successfully', () => {
      const validation = validateConfig();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });
});