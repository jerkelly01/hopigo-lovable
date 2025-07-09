import { z } from 'zod';

// User validation schemas
export const userSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').min(10, 'Phone number must be at least 10 digits').optional(),
  userType: z.enum(['customer', 'provider', 'driver', 'admin'], {
    errorMap: () => ({ message: 'Invalid user type' })
  }),
};

// Service validation schemas
export const serviceSchemas = {
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
};

// Provider validation schemas
export const providerSchemas = {
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100, 'Business name too long'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500, 'Description too long').optional(),
};

// Driver validation schemas
export const driverSchemas = {
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  licensePlate: z.string().min(3, 'License plate must be at least 3 characters').max(20, 'License plate too long'),
};

// Payment validation schemas
export const paymentSchemas = {
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
};

// Location validation schemas
export const locationSchemas = {
  name: z.string().min(2, 'Location name must be at least 2 characters').max(100, 'Location name too long'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address too long'),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude').optional(),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude').optional(),
  coverageRadius: z.number().min(0, 'Coverage radius must be positive').optional(),
};

// Event validation schemas
export const eventSchemas = {
  title: z.string().min(3, 'Event title must be at least 3 characters').max(100, 'Event title too long'),
  description: z.string().max(1000, 'Event description too long').optional(),
  venue: z.string().min(2, 'Venue must be at least 2 characters').max(100, 'Venue name too long'),
  ticketPrice: z.number().min(0, 'Ticket price must be positive'),
  totalTickets: z.number().min(1, 'Must have at least 1 ticket'),
  eventDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Event date must be in the future'
  }),
};

// Booking validation schemas
export const bookingSchemas = {
  bookingDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Booking date cannot be in the past'
  }),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
};

// Utility functions for form validation
export const validateField = <T>(schema: z.ZodSchema<T>, value: T): string | null => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid input';
    }
    return 'Validation error';
  }
};

export const validateForm = <T extends Record<string, any>>(
  schemas: { [K in keyof T]?: z.ZodSchema<T[K]> },
  data: T
): { [K in keyof T]?: string } => {
  const errors: { [K in keyof T]?: string } = {};
  
  for (const key in schemas) {
    const schema = schemas[key];
    if (schema && data[key] !== undefined) {
      const error = validateField(schema, data[key]);
      if (error) {
        errors[key] = error;
      }
    }
  }
  
  return errors;
};

// Real-time validation hook
export const useFormValidation = <T extends Record<string, any>>(
  schemas: { [K in keyof T]?: z.ZodSchema<T[K]> },
  initialData: T
) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<{ [K in keyof T]?: string }>({});
  const [touched, setTouched] = React.useState<{ [K in keyof T]?: boolean }>({});

  const validateField = (field: keyof T, value: T[keyof T]) => {
    const schema = schemas[field];
    if (!schema) return null;

    try {
      schema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Invalid input';
      }
      return 'Validation error';
    }
  };

  const updateField = (field: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const touchField = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, data[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const newErrors = validateForm(schemas, data);
    setErrors(newErrors);
    setTouched(
      Object.keys(schemas).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return Object.keys(newErrors).length === 0;
  };

  return {
    data,
    errors,
    touched,
    updateField,
    touchField,
    validateAll,
    isValid: Object.keys(errors).length === 0
  };
};

// Import React for the hook
import React from 'react';