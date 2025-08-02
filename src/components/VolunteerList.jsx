import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    kendra: "",
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      const snap = await getDocs(collection(db, "volunteers"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVolunteers(data);
      setFilteredVolunteers(data);
    };

    fetchVolunteers();
  }, []);

  useEffect(() => {
    const { search, gender, kendra } = filters;
    let filtered = [...volunteers];

    if (search) {
      filtered = filtered.filter((v) =>
        v.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (gender) {
      filtered = filtered.filter((v) => v.gender === gender);
    }
    if (kendra) {
      filtered = filtered.filter((v) => v.kendra === kendra);
    }

    setFilteredVolunteers(filtered);
  }, [filters, volunteers]);

  const total = volunteers.length;
  const male = volunteers.filter((v) => v.gender === "Male").length;
  const female = volunteers.filter((v) => v.gender === "Female").length;
//  const unassigned = volunteers.filter((v) => !v.eventIds || v.eventIds.length === 0).length;
  const unassigned = volunteers.filter(
 	 (v) => !Array.isArray(v.eventIds) || v.eventIds.length === 0
	).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Male</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{male}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Female</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{female}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unassigned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{unassigned}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="max-w-xs"
        />
        <Select
          onValueChange={(value) =>
            setFilters({ ...filters, gender: value })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by Kendra"
          value={filters.kendra}
          onChange={(e) =>
            setFilters({ ...filters, kendra: e.target.value })
          }
          className="max-w-xs"
        />
      </div>

      {/* Volunteer Table */}
      <div className="overflow-x-auto">
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow className="bg-gray-100 border-b border-gray-300">
              <TableHead className="border-r border-gray-300">Name</TableHead>
              <TableHead className="border-r border-gray-300">Lesson No.</TableHead>
              <TableHead className="border-r border-gray-300">Age</TableHead>
              <TableHead className="border-r border-gray-300">Gender</TableHead>
              <TableHead className="border-r border-gray-300">City</TableHead>
              <TableHead className="border-r border-gray-300">Kendra</TableHead>
              <TableHead className="border-r border-gray-300">State</TableHead>
              <TableHead className="border-r border-gray-300">Country</TableHead>
              <TableHead>Skills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVolunteers.map((v) => (
              <TableRow key={v.id} className="border-b border-gray-200">
                <TableCell className="border-r border-gray-200">{v.name}</TableCell>
                <TableCell className="border-r border-gray-200">{v.lessonNumber}</TableCell>
                <TableCell className="border-r border-gray-200">{v.age}</TableCell>
                <TableCell className="border-r border-gray-200">{v.gender}</TableCell>
                <TableCell className="border-r border-gray-200">{v.city}</TableCell>
                <TableCell className="border-r border-gray-200">{v.kendra}</TableCell>
                <TableCell className="border-r border-gray-200">{v.state}</TableCell>
                <TableCell className="border-r border-gray-200">{v.country}</TableCell>
                <TableCell>{Array.isArray(v.skills) ? v.skills.join(", ") : v.skills}</TableCell>
              </TableRow>
            ))}
            {filteredVolunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-6">
                  No volunteers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VolunteerList;

