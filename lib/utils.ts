import { Faculty } from "@/types";

export const getFacultyNames = (
  facultyIds: number[] | number | undefined,
  faculty: Faculty[],
): string => {
  if (!facultyIds && facultyIds !== 0) return "";

  const ids = Array.isArray(facultyIds) ? facultyIds : [facultyIds];
  return ids
    .map(
      (id) =>
        faculty.find((faculty) => faculty.id === id)?.name ?? `Faculty ${id}`,
    )
    .join(", ");
};
