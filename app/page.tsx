"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm";
import AssessmentDemo from "@/components/ui/AssessmentDemo";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (formData: any) => {
    if (isLogin) {
      if (formData.email && formData.password) {
        localStorage.setItem("userName", formData.email.split("@")[0]);
        router.push("/dashboard");
      }
    } else {
      if (
        formData.name &&
        formData.email &&
        formData.password === formData.confirmPassword
      ) {
        localStorage.setItem("userName", formData.name);
        router.push("/dashboard");
      }
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-1/2 bg-sky-600 text-white p-12 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Academic Analytics System</h1>
        <p className="text-lg opacity-90">
          Manage students, courses, faculty, and grades in one place.
        </p>
      </div>

      <div className="w-1/2 bg-gray-100 p-12 flex flex-col items-center justify-center gap-6">
        <div className="demo-container">
          <AssessmentDemo />
        </div>
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
