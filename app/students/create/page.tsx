"use client";

import { useRouter } from "next/navigation";
import StudentFormComponent from "@/components/forms/StudentFormComponent";
import { Student } from "@/types/index";
import api from "@/lib/api";
import { getNextId } from "@/lib/utils";
import { useToast } from "@/lib/toastContext";

export default function CreateStudentPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (data: Student) => {
    try {
      const students = await api.get("/students");
      const newStudent: Student = {
        id: String(getNextId(students)),
        name: data.name,
        email: data.email,
        year: Number(data.year),
        courses: data.courses.map((course) => String(course)),
        cgpa: data.cgpa ? Number(data.cgpa) : undefined,
      };
      const result = await api.post("/students", newStudent);
      showToast("Student created successfully!", "success");
      router.push(`/students/${result.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create student";
      showToast(errorMessage, "error");
      throw error;
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Student
      </h2>
      <StudentFormComponent
        onSubmit={handleSubmit}
        onCancel={() => router.push("/students")}
      />
    </section>
  );
}
