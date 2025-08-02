// src/components/VolunteerList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const snap = await getDocs(collection(db, "volunteers"));
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVolunteers(list);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {volunteers.map((volunteer) => (
        <Card
          key={volunteer.id}
          className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
          onClick={() => navigate(`/volunteers/${volunteer.id}`)}
        >
          <CardHeader>
            <CardTitle>{volunteer.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{volunteer.email}</p>
            {volunteer.phone && <p className="text-sm text-gray-600">{volunteer.phone}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VolunteerList;

