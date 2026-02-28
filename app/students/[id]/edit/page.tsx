"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentFormComponent from "@/components/forms/StudentFormComponent";
import { Student } from "@/types/index";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await api.get(`/students/${id}`);
        setStudent(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch student",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (data: Student) => {
    try {
      const updatedStudent: Student = {
        id: data.id,
        name: data.name,
        email: data.email,
        year: Number(data.year),
        courses: data.courses.map((course) => String(course)),
        cgpa: data.cgpa ? Number(data.cgpa) : undefined,
      };
      await api.put(`/students/${id}`, updatedStudent);
      router.push(`/students/${id}`);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!student) return <ErrorMessage message="Student not found" />;

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Student
      </h2>
      <StudentFormComponent
        initialData={student}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/students/${id}`)}
      />
    </section>
  );
}
