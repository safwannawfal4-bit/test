import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const ADMIN_ACCOUNT = {
  id: 'admin',
  email: 'admin@alma.com',
  password: '12345678',
  name: 'Admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

function getUsers() {
  const saved = localStorage.getItem('alma-users');
  const users = saved ? JSON.parse(saved) : [];
  if (!users.find(u => u.email === ADMIN_ACCOUNT.email)) {
    users.push(ADMIN_ACCOUNT);
    localStorage.setItem('alma-users', JSON.stringify(users));
  }
  return users;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alma-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('alma-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alma-current-user');
    }
  }, [user]);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Invalid email or password' };
    setUser(found);
    return { success: true, user: found };
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('alma-users', JSON.stringify(users));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => setUser(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
