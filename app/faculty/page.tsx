"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Faculty } from "@/types/index";
import api from "@/lib/api";
import DataTable, { Column } from "@/components/tables/DataTable";
import SearchFilter from "@/components/filters/SearchFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    facultyId: string;
  }>({ isOpen: false, facultyId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const facultyData = await api.get("/faculty");
      setFaculty(facultyData);
      setFilteredFaculty(facultyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredFaculty(faculty);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFaculty(
        faculty.filter(
          (f) =>
            f.name.toLowerCase().includes(term) ||
            f.email.toLowerCase().includes(term),
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/faculty/${id}`);
      setFaculty(faculty.filter((f) => f.id !== id));
      setFilteredFaculty(filteredFaculty.filter((f) => f.id !== id));
      setDeleteConfirm({ isOpen: false, facultyId: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete faculty");
    }
  };

  const columns: Column[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "courses",
      label: "Courses",
      render: (courseIds) => {
        const count = courseIds.length;
        return `${count} course${count !== 1 ? "s" : ""}`;
      },
    },
  ];

  const actionButtons = (row: Faculty) => (
    <div className="flex gap-2">
      <Link
        href={`/faculty/${row.id}`}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        View
      </Link>
      <Link
        href={`/faculty/${row.id}/edit`}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Edit
      </Link>
      <Link
        href={`/faculty/${row.id}/manage`}
        className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
      >
        Manage
      </Link>
      <button
        onClick={() =>
          setDeleteConfirm({ isOpen: true, facultyId: String(row.id) })
        }
        className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Faculty</h2>
        <Link
          href="/faculty/create"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Faculty Member
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
          data={filteredFaculty}
          actions={actionButtons}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
        onConfirm={() => handleDelete(deleteConfirm.facultyId)}
        onCancel={() => setDeleteConfirm({ isOpen: false, facultyId: "" })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
