"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Course, Faculty } from "@/types";
import api from "@/lib/api";
import { getFacultyNames } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const coursesData = await api.get("/courses");
      setCourses(coursesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    }

    try {
      const facultyData = await api.get("/faculty");
      setFaculty(facultyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch faculty");
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  console.log("Courses :", courses);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <Link
          href="/courses/create"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Course
        </Link>
      </div>

      <table className="w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Enrollment</th>
            <th className="px-3 py-2 text-left">Faculty</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b">
              <td className="px-3 py-2">{course.name}</td>
              <td className="px-3 py-2">{course.enrollment}</td>
              <td className="px-3 py-2">
                {getFacultyNames(course.faculty, faculty)}
              </td>
              <td className="px-3 py-2 space-x-2">
                <Link
                  href={`/courses/${course.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  View
                </Link>
                <Link
                  href={`/courses/${course.id}/edit`}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
