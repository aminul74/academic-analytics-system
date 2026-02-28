"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Course, Student, Grade } from "@/types/index";
import api from "@/lib/api";
import { getLetterGrade } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchCourseData = async (courseId: string) => {
    setLoading(true);
    setError("");

    try {
      const courseData = await api.get(`/courses/${courseId}`);
      setCourse(courseData);

      const studentsData = await api.get("/students");
      setStudents(studentsData);

      const gradesData = await api.get("/grades");
      setGrades(
        gradesData.filter((g: Grade) => String(g.courseId) === courseId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch course data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData(id);
  }, [id]);

  const getEnrolledStudents = () => {
    if (!course) return [];
    return students.filter((student) => student.courses.includes(course.id));
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${id}`);
      router.push("/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <ErrorMessage message="Course not found" />;

  const enrolledStudents = getEnrolledStudents();

  return (
    <section className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{course.name}</h2>
        <div className="flex gap-2">
          <Link
            href={`/courses/${id}/edit`}
            className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
            href="/courses"
            className="cursor-pointer px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600 text-sm">Enrollment</div>
          <div className="text-2xl font-semibold">{course.enrollment}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600 text-sm">Enrolled Students</div>
          <div className="text-2xl font-semibold">
            {enrolledStudents.length}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Enrolled Students</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-sm font-semibold">Year</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No students enrolled
                </td>
              </tr>
            ) : (
              enrolledStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/students/${student.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Grades</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold">Student</th>
              <th className="px-6 py-3 text-sm font-semibold">Score</th>
              <th className="px-6 py-3 text-sm font-semibold">Letter</th>
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
                const student = students.find(
                  (student) => String(student.id) === String(grade.studentId),
                );
                return (
                  <tr key={grade.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {student?.name || `Student ${grade.studentId}`}
                    </td>
                    <td className="px-6 py-4">{grade.grade}</td>
                    <td className="px-6 py-4">{getLetterGrade(grade.grade)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
