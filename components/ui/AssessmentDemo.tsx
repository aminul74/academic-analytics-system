"use client";

import { useState } from "react";

export default function AssessmentDemo() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-md bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-lg">
      <h3 className="text-base font-bold text-amber-900 mb-2">
        Assessment Demo
      </h3>
      <p className="text-xs text-amber-800 mb-3">
        This is a demonstration design. No functional authentication is
        implemented.
      </p>
      <div className="bg-white rounded p-2 text-xs text-gray-700 space-y-1">
        <p className="font-semibold mb-2">Example login:</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500">Email: </span>
            <span className="font-mono text-xs">demo@example.com</span>
          </div>
          <button
            onClick={() => handleCopy("demo@example.com", "email")}
            className="ml-2 px-2 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600 cursor-pointer"
          >
            {copied === "email" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500">Password: </span>
            <span className="font-mono text-xs">demo123</span>
          </div>
          <button
            onClick={() => handleCopy("demo123", "password")}
            className="ml-2 px-2 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600 cursor-pointer"
          >
            {copied === "password" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
