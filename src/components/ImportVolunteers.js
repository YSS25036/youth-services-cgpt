const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// Load Firebase Admin SDK credentials
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

fs.createReadStream('volunteers.csv')
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const volunteerData = {
        name: row.name || '',
        lessonNumber: row.lessonNumber || '',
        age: row.age || '',
        gender: row.gender || '',
        city: row.city || '',
        state: row.state || '',
        country: row.country || '',
        kendra: row.kendra || '',
        contact: row.contact || '',
        skills: row.skills || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = db.collection('volunteers').doc(); // auto-ID
      await docRef.set(volunteerData);
      console.log(`✔ Imported: ${volunteerData.name}`);
    } catch (err) {
      console.error(`❌ Error importing ${row.name}:`, err.message);
    }
  })
  .on('end', () => {
    console.log('✅ CSV import completed!');
  });

