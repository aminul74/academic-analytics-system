import { Student } from "../../types";

interface Props {
  students: Student[];
}

export default function TopStudentsTable({ students }: Props) {
  if (!students?.length)
    return <div className="text-gray-500">No students available</div>;

  const sortedStudents = [...students].sort((studentA, studentB) => {
    const gpaA = studentA.gpa ?? 0;
    const gpaB = studentB.gpa ?? 0;
    return gpaB - gpaA;
  });

  const topStudents = sortedStudents.slice(0, 5);

  return (
    <table className="w-full bg-white border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-3 py-2 text-left">Name</th>
          <th className="px-3 py-2 text-left">Year</th>
          <th className="px-3 py-2 text-left">GPA</th>
        </tr>
      </thead>
      <tbody>
        {topStudents.map((student) => (
          <tr key={student.id} className="border-b">
            <td className="px-3 py-2">{student.name}</td>
            <td className="px-3 py-2">{student.year}</td>
            <td className="px-3 py-2">
              {student.gpa !== undefined ? student.gpa.toFixed(2) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
