import { AuthResponse, LoginCredentials } from './auth';
import { User } from '@/lib/types';

// Mock user database for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    emailVerified: true,
    phoneNumber: '+1234567890',
    country: 'France',
    region: 'Île-de-France',
    city: 'Paris',
    address: '123 Rue de Rivoli',
    photoUrl: null,
    website: 'https://johndoe.com',
    bio: 'Passionate treasure hunter',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-01'),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock auth API for presentation
export const mockAuthApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000); // Simulate network delay

    // Demo scenarios based on email
    if (credentials.email === 'success@demo.com') {
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          user: mockUsers[0],
        },
      };
    }

    if (credentials.email === 'invalid@demo.com') {
      throw new Error('Invalid credentials');
    }

    if (credentials.email === 'unverified@demo.com') {
      throw new Error('Email not verified');
    }

    // Default success for any other email
    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          ...mockUsers[0],
          email: credentials.email,
          name: credentials.email.split('@')[0],
        },
      },
    };
  },

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    await delay(1500); // Simulate network delay

    // Demo scenarios based on email domain or specific emails
    if (email === 'existing@demo.com') {
      throw new Error('Email already in use');
    }

    if (email === 'error@demo.com') {
      throw new Error('Server error occurred. Please try again later.');
    }

    if (email === 'network@demo.com') {
      throw new Error('Network error. Please check your connection.');
    }

    if (email === 'validation@demo.com') {
      throw new Error('Invalid email format');
    }

    if (email.includes('success')) {
      // Success scenario - redirect to verification
      return {
        status: 'success',
        message: 'Please check your email to verify your account',
        data: {
          userId: `user_${Date.now()}`,
          user: {
            id: `user_${Date.now()}`,
            name,
            lastname: '',
            username: name.toLowerCase().replace(/\s+/g, ''),
            email,
            emailVerified: false,
            phoneNumber: null,
            country: null,
            region: null,
            city: null,
            address: null,
            photoUrl: null,
            website: null,
            bio: null,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };
    }

    // Default success for demo
    return {
      status: 'success',
      message: 'Please check your email to verify your account',
      data: {
        userId: `user_${Date.now()}`,
        user: {
          id: `user_${Date.now()}`,
          name,
          lastname: '',
          username: name.toLowerCase().replace(/\s+/g, ''),
          email,
          emailVerified: false,
          phoneNumber: null,
          country: null,
          region: null,
          city: null,
          address: null,
          photoUrl: null,
          website: null,
          bio: null,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    };
  },

  logout: async (): Promise<{ status: string; message: string }> => {
    await delay(500);
    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  },

  getCurrentUser: async (): Promise<{
    status: string;
    data: { user: User };
  }> => {
    await delay(300);
    return {
      status: 'success',
      data: { user: mockUsers[0] },
    };
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    await delay(800);
    return { ...mockUsers[0], ...data };
  },

  delete: async (id: string): Promise<{ status: string; message: string }> => {
    await delay(1000);
    return {
      status: 'success',
      message: 'Account deleted successfully',
    };
  },
};

// Demo scenarios documentation
export const DEMO_SCENARIOS = {
  signup: {
    success: {
      email: 'success@demo.com',
      description: 'Successful signup - redirects to verification page',
    },
    existingUser: {
      email: 'existing@demo.com',
      description: 'Email already exists error',
    },
    serverError: {
      email: 'error@demo.com',
      description: 'Server error simulation',
    },
    networkError: {
      email: 'network@demo.com',
      description: 'Network error simulation',
    },
    validationError: {
      email: 'validation@demo.com',
      description: 'Validation error simulation',
    },
  },
  login: {
    success: {
      email: 'success@demo.com',
      description: 'Successful login - redirects to dashboard',
    },
    invalidCredentials: {
      email: 'invalid@demo.com',
      description: 'Invalid credentials error',
    },
    unverifiedEmail: {
      email: 'unverified@demo.com',
      description: 'Email not verified error',
    },
  },
};

export type { User, AuthResponse, LoginCredentials };
