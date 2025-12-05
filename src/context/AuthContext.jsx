import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            }
          } catch (e) {
            console.error('Error getting user doc:', e);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase auth error:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase not configured');
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      setUserRole(userDoc.data().role);
    }
    return result;
  };

  const register = async (email, password, displayName, role) => {
    if (!auth) throw new Error('Firebase not configured');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      displayName,
      role,
      createdAt: new Date().toISOString()
    });
    setUserRole(role);
    return result;
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    logout,
    isSeller: userRole === 'seller',
    isBuyer: userRole === 'buyer'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
