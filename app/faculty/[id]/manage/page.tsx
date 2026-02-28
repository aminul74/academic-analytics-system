"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Faculty, Course, Student } from "@/types/index";
import api from "@/lib/api";
import BulkOperations from "@/components/faculty/BulkOperations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function FacultyManagePage() {
  const params = useParams();
  const id = params.id as string;

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const facultyData = await api.get(`/faculty/${id}`);
      setFaculty(facultyData);

      const coursesData = await api.get("/courses");
      setCourses(coursesData);

      const studentsData = await api.get("/students");
      setStudents(studentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchData();
  };

  if (loading) return <LoadingSpinner />;
  if (!faculty) return <ErrorMessage message="Faculty not found" />;

  return (
    <section className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Manage Students & Grades: {faculty.name}
        </h2>
        <Link
          href={`/faculty/${id}`}
          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to Profile
        </Link>
      </div>

      <BulkOperations
        faculty={faculty}
        courses={courses}
        students={students}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
