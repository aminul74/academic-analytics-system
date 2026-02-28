"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Faculty, Course } from "@/types/index";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface FacultyFormComponentProps {
  initialData?: Faculty;
  onSubmit: (data: Faculty) => Promise<void>;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  courses: Yup.array(),
});

export default function FacultyFormComponent({
  initialData,
  onSubmit,
  onCancel,
}: FacultyFormComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get("/courses");
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const initialValues: Faculty = initialData || {
    id: "",
    name: "",
    email: "",
    courses: [],
  };

  const handleSubmit = async (values: Faculty) => {
    setLoading(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                name="name"
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="name">
                {(msg) => (
                  <div className="text-red-500 text-sm mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email">
                {(msg) => (
                  <div className="text-red-500 text-sm mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Courses
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={values.courses.includes(course.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...values.courses, course.id]
                          : values.courses.filter((id) => id !== course.id);
                        setFieldValue("courses", updated);
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting || loading}
              >
                {loading ? "Saving..." : "Save Faculty"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
