import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value }) => (
  <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
    <p style={{ margin: 0, color: '#666' }}>{label}</p>
  </div>
);

const AdminDashboard = ({ user }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  
  // State for all filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [kendraFilter, setKendraFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  // ✅ NEW: State for the assignment status filter.
  const [assignmentFilter, setAssignmentFilter] = useState('');

  // ✅ NEW: State to store the Set of assigned volunteer IDs for filtering.
  const [assignedVolunteerIds, setAssignedVolunteerIds] = useState(new Set());

  const [stats, setStats] = useState({
    total: 0, male: 0, female: 0, assigned: 0, unassigned: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volunteersSnap, participationSnap] = await Promise.all([
          getDocs(collection(db, 'volunteers')),
          getDocs(collection(db, 'event_participation'))
        ]);
        
        const volunteersData = volunteersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const participationData = participationSnap.docs.map(doc => doc.data());
        
        setVolunteers(volunteersData);

        const assignedIds = new Set(participationData.map(p => p.volunteerId));
        // ✅ NEW: Save the set of assigned IDs to state for use in the filter logic.
        setAssignedVolunteerIds(assignedIds);

        const total = volunteersData.length;
        const male = volunteersData.filter(v => v.gender === 'Male').length;
        const female = volunteersData.filter(v => v.gender === 'Female').length;
        const assigned = assignedIds.size;
        const unassigned = total - assigned;

        setStats({ total, male, female, assigned, unassigned });

      } catch (error) {
        console.error("❌ Firestore fetch error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let results = volunteers;

    // ✅ NEW: Apply the assignment filter first.
    if (assignmentFilter === 'assigned') {
      results = results.filter(v => assignedVolunteerIds.has(v.id));
    } else if (assignmentFilter === 'unassigned') {
      results = results.filter(v => !assignedVolunteerIds.has(v.id));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(v => v.name?.toLowerCase().includes(term) || v.kendra?.toLowerCase().includes(term) || v.contact?.includes(term));
    }
    if (cityFilter) { results = results.filter(v => v.city === cityFilter); }
    if (kendraFilter) { results = results.filter(v => v.kendra === kendraFilter); }
    if (genderFilter) { results = results.filter(v => v.gender === genderFilter); }
    if (skillFilter) {
      results = results.filter(v => v.skills?.toLowerCase().split(',').map(s => s.trim()).includes(skillFilter.toLowerCase()));
    }

    setFilteredVolunteers(results);
  }, [searchTerm, cityFilter, kendraFilter, genderFilter, skillFilter, assignmentFilter, volunteers, assignedVolunteerIds]);

  const uniqueCities = useMemo(() => [...new Set(volunteers.map(v => v.city).filter(Boolean))], [volunteers]);
  const uniqueKendras = useMemo(() => [...new Set(volunteers.map(v => v.kendra).filter(Boolean))], [volunteers]);
  const uniqueGenders = useMemo(() => [...new Set(volunteers.map(v => v.gender).filter(Boolean))], [volunteers]);
  const uniqueSkills = useMemo(() => [...new Set(volunteers.flatMap(v => v.skills ? v.skills.split(',').map(skill => skill.trim()) : []))], [volunteers]);

  const navigate = useNavigate();
  const handleLogout = () => { signOut(auth); };
  const handleVolunteerClick = (id) => { navigate(`/volunteers/${id}`); };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Volunteers Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
        <StatCard label="Total Volunteers" value={stats.total} />
        <StatCard label="Male Volunteers" value={stats.male} />
        <StatCard label="Female Volunteers" value={stats.female} />
        <StatCard label="Assigned to Events" value={stats.assigned} />
        <StatCard label="Unassigned" value={stats.unassigned} />
      </div>

      {/* Filter controls section */}
      <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <input type="text" placeholder="Search by name, kendra, contact..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '0.5rem', width: '300px' }}/>
        
        {/* ✅ NEW: Dropdown for assignment status */}
        <select value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Assignment Status</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>

        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Cities</option>
          {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <select value={kendraFilter} onChange={e => setKendraFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Kendras</option>
          {uniqueKendras.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Genders</option>
          {uniqueGenders.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Skills</option>
          {uniqueSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
        </select>
      </div>

      {/* Main volunteers table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th><th>Lesson #</th><th>Age</th><th>Gender</th><th>City</th><th>Kendra</th><th>Contact</th><th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.map(vol => (
            <tr key={vol.id}>
              <td><span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleVolunteerClick(vol.id)}>{vol.name || '—'}</span></td>
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
    </div>
  );
};

export default AdminDashboard;
