import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { seedIfEmpty } from '../utils/seedData';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { uid: firebaseUser.uid, ...userDoc.data() };
            setUser(userData);
            if (userData.role === 'admin') {
              seedIfEmpty();
            }
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: 'customer',
            });
          }
        } catch (err) {
          console.error('Error fetching user doc:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: 'User',
            role: 'customer',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : err.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later'
          : err.message;
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        name,
        phone,
        role: 'customer',
        createdAt: serverTimestamp(),
        totalSpent: 0,
        orderCount: 0,
      });
      return { success: true };
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists'
          : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters'
          : err.message;
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
