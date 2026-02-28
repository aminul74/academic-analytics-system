import { Faculty, Course } from "@/types";

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
