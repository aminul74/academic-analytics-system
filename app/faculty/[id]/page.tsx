"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Faculty, Course } from "@/types/index";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FacultyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [facultyData, coursesData] = await Promise.all([
        api.get(`/faculty/${id}`),
        api.get("/courses"),
      ]);
      setFaculty(facultyData);
      setCourses(coursesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch faculty data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/faculty/${id}`);
      router.push("/faculty");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete faculty");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!faculty) return <ErrorMessage message="Faculty not found" />;

  const assignedCourses = courses.filter((course) =>
    faculty.courses.includes(course.id),
  );

  return (
    <section className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {faculty.name}
          </h2>
          <p className="text-gray-600 mt-1">{faculty.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/faculty/${id}/edit`}
            className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Edit
          </Link>
          <Link
            href={`/faculty/${id}/manage`}
            className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Manage Students & Grades
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <Link
            href="/faculty"
            className="cursor-pointer px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-600 text-sm">Assigned Courses</div>
        <div className="text-2xl font-semibold text-gray-900 mt-2">
          {assignedCourses.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Assigned Courses
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Enrollment
              </th>
            </tr>
          </thead>
          <tbody>
            {assignedCourses.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No courses assigned
                </td>
              </tr>
            ) : (
              assignedCourses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {course.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.enrollment}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
