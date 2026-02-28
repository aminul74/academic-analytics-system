"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FacultyFormComponent from "@/components/forms/FacultyFormComponent";
import { Faculty } from "@/types/index";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function EditFacultyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await api.get(`/faculty/${id}`);
        setFaculty(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch faculty",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [id]);

  const handleSubmit = async (data: Faculty) => {
    try {
      await api.put(`/faculty/${id}`, data);
      router.push(`/faculty/${id}`);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!faculty) return <ErrorMessage message="Faculty not found" />;

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Faculty Member
      </h2>
      <FacultyFormComponent
        initialData={faculty}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/faculty/${id}`)}
      />
    </section>
  );
}
