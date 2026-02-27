"use client";

import { useRouter } from "next/navigation";
import CourseFormComponent from "@/components/forms/CourseFormComponent";
import api from "@/lib/api";

interface CreateCourseData {
  name: string;
  enrollment: number;
  faculty: number[];
}

export default function CreateCoursePage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateCourseData) => {
    try {
      const payload = {
        id: String(Date.now()),
        name: data.name,
        enrollment: Number(data.enrollment),
        faculty: data.faculty.map(Number),
      };

      const result = await api.post("/courses", payload);
      router.push(`/courses/${result.id}`);
    } catch (err) {
      console.error("Failed to create course:", err);
      alert("Failed to create course");
    }
  };

  const handleCancel = () => {
    router.push("/courses");
  };

  return (
    <section className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Course
      </h1>

      <CourseFormComponent onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
