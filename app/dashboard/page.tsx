"use client";

import { useEffect, useState } from "react";
import EnrollmentBarChart from "../../components/charts/EnrollmentBarChart";
import api from "../../lib/api";
import TopStudentsTable from "@/components/tables/TopStudentsTable";

export default function DashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [studentsRes, coursesRes, facultyRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/faculty"),
      ]);

      setStudents(studentsRes);
      setCourses(coursesRes);
      setFaculty(facultyRes);
    }

    fetchData();
  }, []);

  console.log("Courses ::", courses);
  console.log("Students ::", students);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded">
          <p className="text-gray-500">Total Students</p>
          <p className="text-xl font-semibold">{students.length}</p>
        </div>

        <div className="bg-white p-4 rounded">
          <p className="text-gray-500">Total Courses</p>
          <p className="text-xl font-semibold">{courses.length}</p>
        </div>

        <div className="bg-white p-4 rounded">
          <p className="text-gray-500">Total Faculty</p>
          <p className="text-xl font-semibold">{faculty.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-3">
            Course Enrollment
          </h3>
          <EnrollmentBarChart courses={courses} />
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-3">Top Students</h3>
          <TopStudentsTable students={students} />
        </div>
      </div>
    </div>
  );
}
