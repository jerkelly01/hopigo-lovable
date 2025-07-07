/**
 * Centralized Configuration Management System
 * 
 * This module provides a type-safe, centralized way to manage all application 
 * configuration including environment variables, feature flags, and constants.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface AppConfig {
  // Application Info
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };

  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
    projectId: string;
  };

  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
  };

  // UI Configuration
  ui: {
    theme: {
      defaultMode: 'light' | 'dark' | 'system';
      enableAnimations: boolean;
    };
    pagination: {
      defaultPageSize: number;
      pageSizeOptions: number[];
    };
    notifications: {
      defaultDuration: number;
      maxVisible: number;
    };
  };

  // Feature Flags
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableFileUploads: boolean;
    enableRealTimeUpdates: boolean;
    enableDataExport: boolean;
    enableAuditLog: boolean;
  };

  // File Upload Configuration
  uploads: {
    maxFileSize: number; // in bytes
    allowedTypes: string[];
    avatarSizes: {
      thumbnail: number;
      medium: number;
      large: number;
    };
  };

  // Security Configuration
  security: {
    sessionTimeout: number; // in minutes
    maxLoginAttempts: number;
    passwordMinLength: number;
    enableTwoFactor: boolean;
  };
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultConfig: AppConfig = {
  app: {
    name: 'Admin Dashboard',
    version: '1.0.0',
    environment: 'development',
    debug: true,
  },

  supabase: {
    url: 'https://mswxfxvqlhfqsmckezci.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zd3hmeHZxbGhmcXNtY2tlemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDkwOTAsImV4cCI6MjA2NjQ4NTA5MH0.rl70EaTd19eZY0ytEpYiDRVWvpl73XpoDzFgcVF2hZs',
    projectId: 'mswxfxvqlhfqsmckezci',
  },

  api: {
    baseUrl: '/api',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    },
  },

  ui: {
    theme: {
      defaultMode: 'system',
      enableAnimations: true,
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50, 100],
    },
    notifications: {
      defaultDuration: 5000, // 5 seconds
      maxVisible: 5,
    },
  },

  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableFileUploads: true,
    enableRealTimeUpdates: true,
    enableDataExport: true,
    enableAuditLog: true,
  },

  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    avatarSizes: {
      thumbnail: 64,
      medium: 128,
      large: 256,
    },
  },

  security: {
    sessionTimeout: 60, // 1 hour
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableTwoFactor: false,
  },
};

// =============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// =============================================================================

const productionConfig: Partial<AppConfig> = {
  app: {
    ...defaultConfig.app,
    environment: 'production',
    debug: false,
  },
  api: {
    ...defaultConfig.api,
    timeout: 15000, // Shorter timeout in production
  },
  security: {
    ...defaultConfig.security,
    enableTwoFactor: true,
  },
};

const stagingConfig: Partial<AppConfig> = {
  app: {
    ...defaultConfig.app,
    environment: 'staging',
    debug: false,
  },
};

// =============================================================================
// CONFIGURATION MERGER
// =============================================================================

function mergeConfig(base: AppConfig, override: Partial<AppConfig>): AppConfig {
  return {
    ...base,
    ...override,
    app: { ...base.app, ...override.app },
    supabase: { ...base.supabase, ...override.supabase },
    api: { ...base.api, ...override.api },
    ui: {
      ...base.ui,
      ...override.ui,
      theme: { ...base.ui.theme, ...override.ui?.theme },
      pagination: { ...base.ui.pagination, ...override.ui?.pagination },
      notifications: { ...base.ui.notifications, ...override.ui?.notifications },
    },
    features: { ...base.features, ...override.features },
    uploads: {
      ...base.uploads,
      ...override.uploads,
      avatarSizes: { ...base.uploads.avatarSizes, ...override.uploads?.avatarSizes },
    },
    security: { ...base.security, ...override.security },
  };
}

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

function getEnvironment(): 'development' | 'staging' | 'production' {
  // In a real application, you might check process.env.NODE_ENV or similar
  // For now, we'll use development as default
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    }
    if (hostname.includes('staging')) {
      return 'staging';
    }
    return 'production';
  }
  return 'development';
}

// =============================================================================
// CONFIG INSTANCE
// =============================================================================

function createConfig(): AppConfig {
  const environment = getEnvironment();
  
  switch (environment) {
    case 'production':
      return mergeConfig(defaultConfig, productionConfig);
    case 'staging':
      return mergeConfig(defaultConfig, stagingConfig);
    default:
      return defaultConfig;
  }
}

// =============================================================================
// EXPORTED CONFIG
// =============================================================================

export const config = createConfig();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get a nested configuration value safely
 */
export function getConfigValue<T>(path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current: any = config;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return config.features[feature];
}

/**
 * Get formatted application info
 */
export function getAppInfo() {
  return {
    name: config.app.name,
    version: config.app.version,
    environment: config.app.environment,
    debug: config.app.debug,
  };
}

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig() {
  return {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey,
    projectId: config.supabase.projectId,
  };
}

/**
 * Validate configuration on startup
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required Supabase config
  if (!config.supabase.url) {
    errors.push('Supabase URL is required');
  }
  if (!config.supabase.anonKey) {
    errors.push('Supabase anon key is required');
  }

  // Validate file upload limits
  if (config.uploads.maxFileSize <= 0) {
    errors.push('Max file size must be greater than 0');
  }

  // Validate pagination
  if (config.ui.pagination.defaultPageSize <= 0) {
    errors.push('Default page size must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export default config;