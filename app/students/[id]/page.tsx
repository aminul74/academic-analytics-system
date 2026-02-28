"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Student, Course, Grade } from "@/types/index";
import api from "@/lib/api";
import { getLetterGrade, calculateCGPA } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
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
      const studentData = await api.get(`/students/${id}`);
      setStudent(studentData);

      const coursesData = await api.get("/courses");
      setCourses(coursesData);

      const gradesData = await api.get("/grades");
      setGrades(gradesData.filter((g: Grade) => String(g.studentId) === id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch student data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${id}`);
      router.push("/students");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!student) return <ErrorMessage message="Student not found" />;
  const safeCgpa = calculateCGPA(grades);

  const enrolledCourses = courses.filter((course) =>
    student.courses.includes(course.id),
  );

  return (
    <section className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {student.name}
          </h2>
          <p className="text-gray-600 mt-1">{student.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/students/${id}/edit`}
            className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Edit
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <Link
            href="/students"
            className="cursor-pointer px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Year</div>
          <div className="text-2xl font-semibold text-gray-900">
            {student.year}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">CGPA</div>
          <div className="text-2xl font-semibold text-gray-900">
            {safeCgpa.toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Enrolled Courses</div>
          <div className="text-2xl font-semibold text-gray-900">
            {enrolledCourses.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Enrolled Courses
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
            {enrolledCourses.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No courses enrolled
                </td>
              </tr>
            ) : (
              enrolledCourses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.name}
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

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Grades</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Score
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Letter
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No grades recorded
                </td>
              </tr>
            ) : (
              grades.map((grade) => {
                const course = courses.find(
                  (c) => String(c.id) === String(grade.courseId),
                );
                return (
                  <tr key={grade.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course?.name || `Course ${grade.courseId}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grade.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getLetterGrade(grade.grade)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
