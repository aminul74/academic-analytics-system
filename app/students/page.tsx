"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Student, Course } from "@/types/index";
import api from "@/lib/api";
import DataTable, { Column } from "@/components/tables/DataTable";
import SearchFilter from "@/components/filters/SearchFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getFacultyNames, getCourseNames } from "@/lib/utils";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    studentId: string;
  }>({ isOpen: false, studentId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsData, coursesData] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
      ]);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredStudents(
        students.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term),
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
      setFilteredStudents(filteredStudents.filter((s) => s.id !== id));
      setDeleteConfirm({ isOpen: false, studentId: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student");
    }
  };

  const columns: Column[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "cgpa", label: "CGPA", sortable: true },
    {
      key: "courses",
      label: "Courses",
      render: (courseIds) => getCourseNames(courseIds, courses),
    },
  ];

  const actionButtons = (row: Student) => (
    <div className="flex gap-2">
      <Link
        href={`/students/${row.id}`}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        View
      </Link>
      <Link
        href={`/students/${row.id}/edit`}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Edit
      </Link>
      <button
        onClick={() => setDeleteConfirm({ isOpen: true, studentId: row.id })}
        className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Students</h2>
        <Link
          href="/students/create"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Student
        </Link>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search by name or email..."
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={filteredStudents}
          actions={actionButtons}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={() => handleDelete(deleteConfirm.studentId)}
        onCancel={() => setDeleteConfirm({ isOpen: false, studentId: "" })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
