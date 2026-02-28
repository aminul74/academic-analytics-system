"use client";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Student, Course } from "@/types/index";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface StudentFormComponentProps {
  initialData?: Student;
  onSubmit: (data: Student) => Promise<void>;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  year: Yup.number()
    .min(1, "Year must be 1 or higher")
    .max(4, "Year must be 4 or lower")
    .required("Year is required"),
  gpa: Yup.number()
    .min(0, "GPA must be 0 or higher")
    .max(4, "GPA must be 4 or lower"),
  courses: Yup.array(),
});

export default function StudentFormComponent({
  initialData,
  onSubmit,
  onCancel,
}: StudentFormComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const initialValues: Student = initialData || {
    id: "",
    name: "",
    email: "",
    year: 1,
    courses: [],
    gpa: 0,
  };

  const handleSubmit = async (values: Student) => {
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
        {({ values, isSubmitting, setFieldValue }) => (
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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <Field
                  name="year"
                  type="number"
                  min="1"
                  max="4"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="year">
                  {(msg) => (
                    <div className="text-red-500 text-sm mt-1">{msg}</div>
                  )}
                </ErrorMessage>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  GPA
                </label>
                <Field
                  name="gpa"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="gpa">
                  {(msg) => (
                    <div className="text-red-500 text-sm mt-1">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrolled Courses
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
                        if (e.target.checked) {
                          setFieldValue("courses", [
                            ...values.courses,
                            course.id,
                          ]);
                        } else {
                          setFieldValue(
                            "courses",
                            values.courses.filter((id) => id !== course.id),
                          );
                        }
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
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting || loading}
              >
                {loading ? "Saving..." : "Save Student"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
