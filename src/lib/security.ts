import DOMPurify from 'dompurify';

// Input sanitization utilities
export const sanitizeInput = {
  // Sanitize HTML content
  html: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  },

  // Sanitize plain text (remove HTML tags completely)
  text: (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  },

  // Validate email format
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate and sanitize user name
  name: (name: string): string => {
    // Remove HTML tags and limit length
    const cleaned = DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return cleaned.slice(0, 100).trim();
  },

  // Validate user type
  userType: (type: string): boolean => {
    const validTypes = ['customer', 'provider', 'driver', 'admin'];
    return validTypes.includes(type);
  }
};

// Authorization utilities
export const authorize = {
  // Check if user has admin role client-side (for UI only)
  isAdmin: (roles: string[]): boolean => {
    return roles.includes('admin');
  },

  // Check if user has specific role
  hasRole: (roles: string[], requiredRole: string): boolean => {
    return roles.includes(requiredRole);
  },

  // Check if user can perform action on resource
  canModifyUser: (currentUserId: string, targetUserId: string, isAdmin: boolean): boolean => {
    return isAdmin || currentUserId === targetUserId;
  }
};

// Input validation schemas
export const validation = {
  user: {
    fullName: (name: string): string | null => {
      if (!name) return 'Full name is required';
      if (name.length < 2) return 'Full name must be at least 2 characters';
      if (name.length > 100) return 'Full name must be less than 100 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Full name contains invalid characters';
      return null;
    },

    email: (email: string): string | null => {
      if (!email) return 'Email is required';
      if (!sanitizeInput.email(email)) return 'Invalid email format';
      return null;
    },

    userType: (type: string): string | null => {
      if (!sanitizeInput.userType(type)) return 'Invalid user type';
      return null;
    }
  }
};

// Rate limiting for client-side operations
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const keyAttempts = this.attempts.get(key) || [];
    const recentAttempts = keyAttempts.filter(time => time > windowStart);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  clear(key: string): void {
    this.attempts.delete(key);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();