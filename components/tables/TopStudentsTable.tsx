import { Student } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
interface Props {
  students: Student[];
}

export default function TopStudentsTable({ students }: Props) {
  if (!students?.length) return <LoadingSpinner />;

  const sortedStudents = [...students].sort((studentA, studentB) => {
    const cgpaA = studentA.cgpa ?? 0;
    const cgpaB = studentB.cgpa ?? 0;
    return cgpaB - cgpaA;
  });

  const topStudents = sortedStudents.slice(0, 5);

  return (
    <table className="w-full bg-white border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-3 py-2 text-left">Name</th>
          <th className="px-3 py-2 text-left">Year</th>
          <th className="px-3 py-2 text-left">CGPA</th>
        </tr>
      </thead>
      <tbody>
        {topStudents.map((student) => (
          <tr key={student.id} className="border-b">
            <td className="px-3 py-2">{student.name}</td>
            <td className="px-3 py-2">{student.year}</td>
            <td className="px-3 py-2">
              {student.cgpa !== undefined ? student.cgpa.toFixed(2) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
