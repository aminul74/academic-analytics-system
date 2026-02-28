"use client";

import { useEffect, useState } from "react";
import EnrollmentBarChart from "@/components/charts/EnrollmentBarChart";
import api from "@/lib/api";
import TopStudentsTable from "@/components/tables/TopStudentsTable";
import { exportToCSV } from "@/lib/exportUtils";

export default function DashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const studentsRes = await api.get("/students");
      const coursesRes = await api.get("/courses");
      const facultyRes = await api.get("/faculty");

      setStudents(studentsRes);
      setCourses(coursesRes);
      setFaculty(facultyRes);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(students, "students")}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Export Students
          </button>
          <button
            onClick={() => exportToCSV(courses, "courses")}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Export Courses
          </button>
          <button
            onClick={() => exportToCSV(faculty, "faculty")}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Export Faculty
          </button>
        </div>
      </div>

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
