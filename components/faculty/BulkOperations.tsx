"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Faculty, Course, Student, Grade } from "@/types/index";
import api from "@/lib/api";

interface BulkOperationsProps {
  faculty: Faculty;
  courses: Course[];
  students: Student[];
  onSuccess: () => void;
}

type Tab = "assign" | "grades" | "remove";

const TABS: { key: Tab; label: string }[] = [
  { key: "assign", label: "Assign Students" },
  { key: "grades", label: "Update Grades" },
  { key: "remove", label: "Remove Students" },
];

const assignSchema = Yup.object({
  selectedStudents: Yup.array().min(1, "Select at least one student"),
  courseId: Yup.string().required("Select a course"),
});

function StudentCheckboxList({
  students,
  selected,
  onChange,
}: {
  students: Student[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string, checked: boolean) =>
    onChange(
      checked
        ? [...selected, id]
        : selected.filter((student) => student !== id),
    );

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
      {students.map((student) => (
        <label key={student.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded"
            checked={selected.includes(student.id)}
            onChange={(e) => toggle(student.id, e.target.checked)}
          />
          <span>{student.name}</span>
        </label>
      ))}
    </div>
  );
}

function CourseSelect({ courses }: { courses: Course[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course
      </label>
      <Field
        as="select"
        name="courseId"
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </Field>
    </div>
  );
}

export default function BulkOperations({
  faculty,
  courses,
  students,
  onSuccess,
}: BulkOperationsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("assign");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const assignedCourses = courses.filter((course) =>
    faculty.courses.includes(course.id),
  );

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await fn();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAssign = async ({
    selectedStudents,
    courseId,
  }: {
    selectedStudents: string[];
    courseId: string;
  }) => {
    if (!courseId || !selectedStudents.length)
      return setError("Please select course and students");
    await withLoading(async () => {
      await Promise.all(
        selectedStudents.map((id) => {
          const student = students.find((s) => s.id === id)!;
          if (!student.courses.includes(courseId))
            student.courses.push(courseId);
          return api.put(`/students/${id}`, student);
        }),
      );
      setSuccess(`Successfully assigned ${selectedStudents.length} student(s)`);
    });
  };

  const handleBulkGradeUpdate = async (
    courseId: string,
    gradeData: { studentId: string; grade: number }[],
  ) => {
    await withLoading(async () => {
      const grades = await api.get("/grades");
      const maxId = Math.max(
        ...grades.map((grade: Grade) => Number(grade.id)),
        0,
      );
      let newIdCounter = maxId;

      const updates = gradeData
        .filter((grade) => grade.grade > 0)
        .map((grade) => {
          const existing = grades.find(
            (gradeRecord: Grade) =>
              gradeRecord.studentId === grade.studentId &&
              gradeRecord.courseId === courseId,
          );
          if (existing) {
            existing.grade = grade.grade;
            return api.put(`/grades/${existing.id}`, existing);
          }
          return api.post("/grades", {
            id: String(++newIdCounter),
            studentId: grade.studentId,
            courseId,
            grade: grade.grade,
          });
        });

      await Promise.all(updates);
      setSuccess(
        `Successfully updated grades for ${updates.length} student(s)`,
      );
    });
  };

  const handleBulkRemove = async ({
    selectedStudents,
    courseId,
  }: {
    selectedStudents: string[];
    courseId: string;
  }) => {
    if (!courseId || !selectedStudents.length)
      return setError("Please select course and students");
    await withLoading(async () => {
      await Promise.all(
        selectedStudents.map((id) => {
          const student = students.find(
            (studentRecord) => studentRecord.id === id,
          )!;
          student.courses = student.courses.filter(
            (enrolledCourseId) => enrolledCourseId !== courseId,
          );
          return api.put(`/students/${id}`, student);
        }),
      );
      setSuccess(`Successfully removed ${selectedStudents.length} student(s)`);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b flex">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`cursor-pointer px-6 py-4 font-medium border-b-2 ${
              activeTab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
            {success}
          </div>
        )}

        {activeTab === "assign" && (
          <Formik
            initialValues={{ selectedStudents: [] as string[], courseId: "" }}
            validationSchema={assignSchema}
            onSubmit={handleBulkAssign}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <CourseSelect courses={assignedCourses} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Students
                  </label>
                  <StudentCheckboxList
                    students={students}
                    selected={values.selectedStudents}
                    onChange={(ids) => setFieldValue("selectedStudents", ids)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Assign Students"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {activeTab === "grades" && (
          <Formik
            initialValues={{
              courseId: "",
              grades: {} as Record<string, number>,
            }}
            onSubmit={({ courseId, grades }) => {
              const gradeData = Object.entries(grades).map(([id, grade]) => ({
                studentId: id,
                grade,
              }));
              handleBulkGradeUpdate(courseId, gradeData);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <CourseSelect courses={assignedCourses} />
                {values.courseId !== "" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grades
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {students
                        .filter((student) =>
                          student.courses.includes(values.courseId),
                        )
                        .map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <span>{student.name}</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Grade"
                              className="w-24 px-2 py-1 border rounded"
                              onChange={(e) =>
                                setFieldValue("grades", {
                                  ...values.grades,
                                  [student.id]: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || !values.courseId}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Update Grades"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {activeTab === "remove" && (
          <Formik
            initialValues={{ selectedStudents: [] as string[], courseId: "" }}
            onSubmit={handleBulkRemove}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <CourseSelect courses={assignedCourses} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Students
                  </label>
                  <StudentCheckboxList
                    students={students}
                    selected={values.selectedStudents}
                    onChange={(ids) => setFieldValue("selectedStudents", ids)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Remove Students"}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
