"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentFormComponent from "@/components/forms/StudentFormComponent";
import { Student } from "@/types/index";
import api from "@/lib/api";
import { useToast } from "@/lib/toastContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
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
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch student";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, showToast]);

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
      showToast("Student updated successfully!", "success");
      router.push(`/students/${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update student";
      showToast(errorMessage, "error");
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
