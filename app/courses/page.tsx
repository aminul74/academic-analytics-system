"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course, Faculty } from "@/types/index";
import api from "@/lib/api";
import DataTable, { Column } from "@/components/tables/DataTable";
import SearchFilter from "@/components/filters/SearchFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getFacultyNames } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await api.get("/courses");
        setCourses(coursesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch courses",
        );
      }

      try {
        const facultyData = await api.get("/faculty");
        setFaculty(facultyData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch faculty",
        );
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/courses/${deletingId}`);
      setCourses((prev) => prev.filter((c) => c.id !== deletingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: Column[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "enrollment", label: "Enrollment", sortable: true },
    {
      key: "faculty",
      label: "Faculty",
      render: (ids) => getFacultyNames(ids, faculty),
    },
  ];

  const renderActions = (row: Course) => (
    <div className="flex gap-2">
      <Link
        href={`/courses/${row.id}`}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        View
      </Link>
      <Link
        href={`/courses/${row.id}/edit`}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Edit
      </Link>
      <button
        onClick={() => setDeletingId(row.id)}
        className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Courses</h2>
        <Link
          href="/courses/create"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Course
        </Link>
      </div>

      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      <SearchFilter
        onSearch={setSearch}
        placeholder="Search by course name..."
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCourses}
          actions={renderActions}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
