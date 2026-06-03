'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'user-demo',
  name: 'Dileepa',
  email: 'demo@garmentos.lk',
  phone: '0701234567',
  address: '123 Galle Road, Colombo 03, Sri Lanka',
  password: 'password123',
};

export function AuthProvider({ children, brandId }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load users and session on mount or when brand changes
  useEffect(() => {
    if (!brandId) return;
    try {
      const storedUsers = localStorage.getItem(`trio_users_${brandId}`);
      let currentUsers = [];
      if (storedUsers) {
        currentUsers = JSON.parse(storedUsers);
      } else {
        // Seed default demo user for this brand
        currentUsers = [DEMO_USER];
        localStorage.setItem(`trio_users_${brandId}`, JSON.stringify(currentUsers));
      }
      setUsers(currentUsers);

      const storedSession = localStorage.getItem(`trio_current_user_${brandId}`);
      if (storedSession) {
        setCurrentUser(JSON.parse(storedSession));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Failed to load user auth data:', e);
    }
    setIsHydrated(true);
  }, [brandId]);

  const login = (emailOrPhone, password) => {
    const matched = users.find(
      u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
    );

    if (!matched) {
      throw new Error('Invalid email/phone number or password.');
    }

    const sessionUser = { ...matched };
    delete sessionUser.password; // Keep session safe from raw password leakage

    setCurrentUser(sessionUser);
    localStorage.setItem(`trio_current_user_${brandId}`, JSON.stringify(sessionUser));
    return sessionUser;
  };

  const register = (name, email, phone, address, password) => {
    // Check if phone or email already taken in this brand
    const exists = users.some(u => u.email === email || u.phone === phone);
    if (exists) {
      throw new Error('An account with this email or phone number already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      address,
      password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(`trio_users_${brandId}`, JSON.stringify(updatedUsers));

    // Automatically sign in
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    setCurrentUser(sessionUser);
    localStorage.setItem(`trio_current_user_${brandId}`, JSON.stringify(sessionUser));
    return sessionUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(`trio_current_user_${brandId}`);
  };

  const updateProfile = (updatedDetails) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedDetails };
    setCurrentUser(updatedUser);
    localStorage.setItem(`trio_current_user_${brandId}`, JSON.stringify(updatedUser));

    // Update in registered user base for this brand
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updatedDetails };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem(`trio_users_${brandId}`, JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isHydrated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
