"use client";

import { useRouter } from "next/navigation";
import FacultyFormComponent from "@/components/forms/FacultyFormComponent";
import { Faculty } from "@/types/index";
import api from "@/lib/api";
import { getNextId } from "@/lib/utils";

export default function CreateFacultyPage() {
  const router = useRouter();

  const handleSubmit = async (data: Faculty) => {
    try {
      const faculty = await api.get("/faculty");
      const newFaculty = {
        ...data,
        id: String(getNextId(faculty)),
      };
      const result = await api.post("/faculty", newFaculty);
      router.push(`/faculty/${result.id}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add Faculty Member
      </h2>
      <FacultyFormComponent
        onSubmit={handleSubmit}
        onCancel={() => router.push("/faculty")}
      />
    </section>
  );
}
