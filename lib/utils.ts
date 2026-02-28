import { Faculty, Course, Grade } from "@/types";

export const getLetterGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "D";
  return "F";
};

export const getGradePoints = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 80) return 3.3;
  if (score >= 75) return 3.0;
  if (score >= 70) return 2.7;
  if (score >= 65) return 2.3;
  if (score >= 60) return 2.0;
  if (score >= 55) return 1.0;
  return 0.0;
};

export const calculateCGPA = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  const sum = grades.reduce(
    (acc, grade) => acc + getGradePoints(grade.grade),
    0,
  );
  return Math.round((sum / grades.length) * 100) / 100;
};

export const getFacultyNames = (
  facultyIds: string[] | string | undefined,
  faculty: Faculty[],
): string => {
  if (!facultyIds) return "";

  const ids = Array.isArray(facultyIds) ? facultyIds : [facultyIds];
  return ids
    .map(
      (id) =>
        faculty.find((faculty) => faculty.id === id)?.name ?? `Faculty ${id}`,
    )
    .join(", ");
};

export const getCourseNames = (
  courseIds: string[] | undefined,
  courses: Course[],
): string => {
  if (!courseIds || courseIds.length === 0) return "";

  return courseIds
    .map(
      (id) =>
        courses.find((course) => course.id === id)?.name ?? `Course ${id}`,
    )
    .join(", ");
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getNextId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
};
