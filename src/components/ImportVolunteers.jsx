import React from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Papa from 'papaparse';

const ImportVolunteers = () => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const data = results.data;
        for (let record of data) {
          const docRef = doc(db, 'volunteers', record.uid || record.email); // fallback to email if no UID
          await setDoc(docRef, {
            name: record.name,
	    lesson: record.lessonNumber,	
            age: record.age,
            gender: record.gender,
            city: record.city,
            state: record.state,
            country: record.country,
            contact: record.contact,
            kendra: record.kendra,
            skills: record.skills,
          });
        }
        alert('Import complete!');
      },
    });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Offline Volunteer Import (CSV)</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default ImportVolunteers;

