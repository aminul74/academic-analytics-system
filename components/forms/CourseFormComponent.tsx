"use client";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Course, Faculty } from "@/types/index";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface CourseFormComponentProps {
  initialData?: Course;
  onSubmit: (data: Course) => Promise<void>;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Course name is required"),
  enrollment: Yup.number()
    .min(0, "Enrollment must be 0 or higher")
    .required("Enrollment is required"),
  faculty: Yup.array(),
});

export default function CourseFormComponent({
  initialData,
  onSubmit,
  onCancel,
}: CourseFormComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await api.get("/faculty");
        setFaculty(data);
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      }
    };
    fetchFaculty();
  }, []);

  const initialValues: Course = initialData || {
    id: "",
    name: "",
    faculty: [],
    enrollment: 0,
  };

  const handleSubmit = async (values: Course) => {
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
                Course Name
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
                Enrollment Count
              </label>
              <Field
                name="enrollment"
                type="number"
                min="0"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="enrollment">
                {(msg) => (
                  <div className="text-red-500 text-sm mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Faculty
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {faculty.map((fac) => (
                  <label
                    key={fac.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="assignedFaculty"
                      checked={values.faculty[0] === fac.id}
                      onChange={() => {
                        setFieldValue("faculty", [fac.id]);
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-700">{fac.name}</span>
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
                {loading ? "Saving..." : "Save Course"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
