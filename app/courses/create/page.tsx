"use client";

import { useRouter } from "next/navigation";
import CourseFormComponent from "@/components/forms/CourseFormComponent";
import { Course } from "@/types/index";
import api from "@/lib/api";
import { getNextId } from "@/lib/utils";

export default function CreateCoursePage() {
  const router = useRouter();

  const handleSubmit = async (data: Course) => {
    try {
      const courses = await api.get("/courses");
      const newId = String(getNextId(courses));
      const newCourse: Course = {
        id: newId,
        name: data.name,
        enrollment: Number(data.enrollment),
        faculty: data.faculty.map((f) => String(f)),
      };
      const result = await api.post("/courses", newCourse);
      const idToNavigate = result.id || newId;
      router.push(`/courses/${idToNavigate}`);
    } catch (err) {
      console.error("Failed to create course:", err);
      throw err;
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Course
      </h2>
      <CourseFormComponent
        onSubmit={handleSubmit}
        onCancel={() => router.push("/courses")}
      />
    </section>
  );
}
