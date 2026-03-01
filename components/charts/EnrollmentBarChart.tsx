"use client";

import Chart from "react-apexcharts";
import { Course } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  courses: Course[];
}

export default function EnrollmentBarChart({ courses }: Props) {
  if (!courses.length) {
    return <LoadingSpinner />;
  }

  const options = {
    chart: { id: "enrollment-bar-chart" },
    xaxis: {
      categories: courses.map((course) => course.name),
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: false,
        trim: false,
      },
    },
  };

  const series = [
    { name: "Enrollment", data: courses.map((course) => course.enrollment) },
  ];

  return <Chart type="bar" height={300} options={options} series={series} />;
}
