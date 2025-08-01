import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileForm = ({ user }) => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    kendra: '',
    contact: '',
    skills: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      console.log("User not found. Waiting...");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'volunteers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No existing profile. Starting fresh.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("[handleSubmit] Submit triggered");

  try {
    const docRef = doc(db, 'volunteers', user.uid);
    console.log("[handleSubmit] Saving profile:", profile);

    await setDoc(docRef, profile);
    
    console.log("[handleSubmit] Save successful");
    alert("Profile saved!");
  } catch (err) {
    console.error("[handleSubmit] Error saving profile:", err);
    alert("Error saving profile: " + err.message);
  }
};
  
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'volunteers', user.uid), profile);
    alert("Profile saved!");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Volunteer Profile</h2>

      <input name="name" value={profile.name} onChange={handleChange} placeholder="Full Name" required />
      <input name="age" value={profile.age} onChange={handleChange} placeholder="Age" type="number" />
      <input name="gender" value={profile.gender} onChange={handleChange} placeholder="Gender" />
      <input name="city" value={profile.city} onChange={handleChange} placeholder="City" />
      <input name="state" value={profile.state} onChange={handleChange} placeholder="State" />
      <input name="country" value={profile.country} onChange={handleChange} placeholder="Country" />
      <input name="kendra" value={profile.kendra} onChange={handleChange} placeholder="Kendra Name" />
      <input name="contact" value={profile.contact} onChange={handleChange} placeholder="Contact Number" />
      <input name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills (comma-separated)" />

      <button type="submit">Save Profile</button>
    </form>
  );
};

export default ProfileForm;

