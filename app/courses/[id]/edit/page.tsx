"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseFormComponent from "@/components/forms/CourseFormComponent";
import { Course } from "@/types/index";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (data: Course) => {
    const updatedCourse: Course = {
      id: data.id,
      name: data.name,
      enrollment: Number(data.enrollment),
      faculty: data.faculty.map((f) => String(f)),
    };
    await api.put(`/courses/${id}`, updatedCourse);
    router.push(`/courses/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !course)
    return <ErrorMessage message={error || "Course not found"} />;

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Course</h2>
      <CourseFormComponent
        initialData={course}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/courses/${id}`)}
      />
    </section>
  );
}
