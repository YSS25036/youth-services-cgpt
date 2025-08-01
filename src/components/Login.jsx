import React, { useEffect, useState } from 'react';
import { auth, provider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import DashboardHome from './DashboardHome';

const Login = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckDone, setAdminCheckDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);

      if (currentUser) {
        try {
          const snapshot = await getDocs(collection(db, 'admins'));
          const adminEmails = snapshot.docs.map(doc => doc.data().email);
          setIsAdmin(adminEmails.includes(currentUser.email));
        } catch (err) {
          console.error("⚠️ Failed to fetch admins from Firestore:", err);
        } finally {
          setAdminCheckDone(true);
        }
      } else {
        setAdminCheckDone(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!authChecked || !adminCheckDone) return <p>Loading...</p>;

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Welcome, {user.displayName}</h3>
      <p>Email: {user.email}</p>
      <img src={user.photoURL} alt="avatar" width={60} style={{ borderRadius: '50%' }} />
      <br />
      <button onClick={handleLogout}>Logout</button>
      <hr />
      {isAdmin ? (
        <DashboardHome />
      ) : (
        <p style={{ color: 'red' }}>❌ You are not authorized to access the Admin Dashboard.</p>
      )}
    </div>
  );
};

export default Login;

