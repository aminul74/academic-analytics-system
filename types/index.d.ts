export interface Student {
  id: number;
  name: string;
  email: string;
  year: number;
  courses: number[];
  gpa?: number;
}

export interface Course {
  id: string;
  name: string;
  faculty: number[];
  enrollment: number;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  courses: number[];
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  grade: number;
}
