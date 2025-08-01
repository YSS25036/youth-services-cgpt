import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import AssignVolunteers from './components/AssignVolunteers';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!user ? <Login /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;

