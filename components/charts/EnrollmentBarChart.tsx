"use client";

import dynamic from "next/dynamic";
import { Course } from "../../types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  courses: Course[];
}

export default function EnrollmentBarChart({ courses }: Props) {
  if (!courses || courses.length === 0) {
    return <div className="text-gray-500">No courses available</div>;
  }

  const options = {
    chart: { id: "bar-chart" },
    xaxis: { categories: courses.map((c) => c.name) },
  };

  const series = [
    { name: "Enrollment", data: courses.map((c) => c.enrollment) },
  ];

  return <Chart options={options} series={series} type="bar" height={300} />;
}
