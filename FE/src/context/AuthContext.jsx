import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

// Create a Context for Authentication
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // --- States ---
  const [user, setUser] = useState(null);       // Stores the current logged-in user details (null if not logged in)
  const [loading, setLoading] = useState(true); // True when checking if user is already logged in on page refresh
  const [error, setError] = useState(null);     // Stores authentication-related error messages

  // --- Role Mapping Helpers ---
  // The frontend uses nice names: 'Job Seeker', 'Recruiter', 'Admin'
  // The backend uses lowercase database values: 'jobseeker', 'employer', 'admin'

  // Converts frontend role name to backend value
  const mapRoleToBackend = (role) => {
    const roles = {
      'Job Seeker': 'jobseeker',
      'Recruiter': 'employer',
      'Admin': 'admin',
    };
    return roles[role] || 'jobseeker'; // Default to jobseeker if not matched
  };

  // Converts backend value back to frontend role name
  const mapRoleToFrontend = (role) => {
    const roles = {
      'jobseeker': 'Job Seeker',
      'employer': 'Recruiter',
      'admin': 'Admin',
    };
    return roles[role] || 'Job Seeker'; // Default to Job Seeker if not matched
  };

  // --- Check Active Session on Page Load ---
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Request the '/auth/me' endpoint (uses cookies for validation)
        const response = await api.get('/auth/me');

        if (response.data) {
          // If user exists, convert role for frontend use and store in state
          const formattedUser = {
            ...response.data,
            role: mapRoleToFrontend(response.data.role),
          };
          setUser(formattedUser);
        }
      } catch (err) {
        // If request fails, it means there is no active session (user is not logged in)
        setUser(null);
      } finally {
        // Set loading to false once the check is complete
        setLoading(false);
      }
    };

    checkUserSession();

    // Event listener: Logs out user if Axios catches a 401 refresh failure (session expired)
    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth-logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForceLogout);
    };
  }, []);

  // --- Login Function ---
  const login = async (email, password) => {
    setError(null); // Reset any existing errors
    try {
      // Send login credentials to backend
      const response = await api.post('/auth/login', { email, password });

      // Convert backend role format to frontend format
      const formattedUser = {
        ...response.data,
        role: mapRoleToFrontend(response.data.role),
      };

      // Save logged-in user in React state
      setUser(formattedUser);
      return formattedUser;
    } catch (err) {
      // Capture error message from backend or use a default one
      const errorMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errorMsg);
      throw new Error(errorMsg); // Re-throw so component can handle UI updates
    }
  };

  // --- Register Function ---
  const register = async (name, email, password, role) => {
    setError(null); // Reset errors
    try {
      // Map frontend role choice (e.g. 'Recruiter') to backend string (e.g. 'employer')
      const backendRole = mapRoleToBackend(role);

      // Send registration details to backend
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role: backendRole,
      });

      // Format response and save user to state
      const formattedUser = {
        ...response.data,
        role: mapRoleToFrontend(response.data.role),
      };

      setUser(formattedUser);
      return formattedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // --- Logout Function ---
  const logout = async () => {
    setError(null);
    try {
      // Notify backend to clear authentication cookies
      await api.post('/auth/logout');
      toast.success('Logged out successfully!');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      // Always clear user from React state locally, even if backend request fails
      setUser(null);
    }
  };

  // --- Forgot Password (Send OTP) ---
  const forgotPassword = async (email) => {
    setError(null);
    try {
      // Request backend to send a 6-digit OTP code to the email
      await api.post('/auth/forgotpassword', { email });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send reset code.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // --- Reset Password (Verify OTP & Update Password) ---
  const resetPassword = async (email, otp, newPassword) => {
    setError(null);
    try {
      // Send email, OTP, and the new password to update in database
      await api.put('/auth/resetpassword', { email, otp, newPassword });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password. Check your OTP.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Context value exposed to all child components
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for simple usage of auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
