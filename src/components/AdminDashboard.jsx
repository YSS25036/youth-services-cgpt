import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [kendraFilter, setKendraFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'volunteers'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVolunteers(data);
      } catch (error) {
        console.error("❌ Firestore fetch error:", error);
      }
    };

    fetchVolunteers();
  }, []);

  useEffect(() => {
    let results = volunteers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        v =>
          v.name?.toLowerCase().includes(term) ||
          v.kendra?.toLowerCase().includes(term) ||
          v.contact?.includes(term)
      );
    }

    if (cityFilter) {
      results = results.filter(v => v.city === cityFilter);
    }

    if (kendraFilter) {
      results = results.filter(v => v.kendra === kendraFilter);
    }

    if (genderFilter) {
      results = results.filter(v => v.gender === genderFilter);
    }

    if (skillFilter) {
      results = results.filter(v =>
        v.skills
          ?.toLowerCase()
          .split(',')
          .map(s => s.trim())
          .includes(skillFilter.toLowerCase())
      );
    }

    setFilteredVolunteers(results);
  }, [searchTerm, cityFilter, kendraFilter, genderFilter, skillFilter, volunteers]);

  const uniqueCities = [...new Set(volunteers.map(v => v.city).filter(Boolean))];
  const uniqueKendras = [...new Set(volunteers.map(v => v.kendra).filter(Boolean))];
  const uniqueGenders = [...new Set(volunteers.map(v => v.gender).filter(Boolean))];
  const uniqueSkills = [...new Set(volunteers.flatMap(v =>
    v.skills ? v.skills.split(',').map(skill => skill.trim()) : []
  ))];

  const handleLogout = () => {
    signOut(auth);
  };

const navigate = useNavigate();

const handleVolunteerClick = (id) => {
  navigate(`/volunteers/${id}`);
};

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name, kendra, contact..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem', width: '300px' }}
        />

        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }}>
          <option value="">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select value={kendraFilter} onChange={e => setKendraFilter(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }}>
          <option value="">All Kendras</option>
          {uniqueKendras.map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }}>
          <option value="">All Genders</option>
          {uniqueGenders.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Skills</option>
          {uniqueSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {filteredVolunteers.length === 0 ? (
        <p>No matching records found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Lesson #</th>
              <th>Age</th>
              <th>Gender</th>
              <th>City</th>
              <th>Kendra</th>
              <th>Contact</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map(vol => (
              <tr key={vol.id}>
                <td>{vol.name || '—'}</td>
                <td>
   			<span
    			style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
    			onClick={() => handleVolunteerClick(vol.id)}
  			>
    			{vol.name || '—'}
  			</span>
		</td>
	        <td>{vol.lessonNumber || '—'}</td>
                <td>{vol.age || '—'}</td>
                <td>{vol.gender || '—'}</td>
                <td>{vol.city || '—'}</td>
                <td>{vol.kendra || '—'}</td>
                <td>{vol.contact || '—'}</td>
                <td>{vol.skills || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;

