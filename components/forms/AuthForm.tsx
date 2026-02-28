import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (credentials: any) => void;
  onToggle: () => void;
}

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const signupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function AuthForm({
  isLogin,
  onSubmit,
  onToggle,
}: AuthFormProps) {
  const validationSchema = isLogin ? loginSchema : signupSchema;

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                    errors.name && touched.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                  errors.password && touched.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 cursor-pointer"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="text-sky-600 font-semibold hover:underline cursor-pointer"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </div>
  );
}
