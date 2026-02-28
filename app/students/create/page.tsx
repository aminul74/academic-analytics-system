"use client";

import { useRouter } from "next/navigation";
import StudentFormComponent from "@/components/forms/StudentFormComponent";
import { Student } from "@/types/index";
import api from "@/lib/api";
import { getNextId } from "@/lib/utils";

export default function CreateStudentPage() {
  const router = useRouter();

  const handleSubmit = async (data: Student) => {
    try {
      const students = await api.get("/students");
      const newStudent: Student = {
        id: String(getNextId(students)),
        name: data.name,
        email: data.email,
        year: Number(data.year),
        courses: data.courses.map((c) => String(c)),
        gpa: data.gpa ? Number(data.gpa) : undefined,
      };
      const result = await api.post("/students", newStudent);
      router.push(`/students/${result.id}`);
    } catch (error) {
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
