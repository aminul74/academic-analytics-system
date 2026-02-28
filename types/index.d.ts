export interface Student {
  id: string;
  name: string;
  email: string;
  year: number;
  courses: string[];
  gpa?: number;
}

export interface Course {
  id: string;
  name: string;
  faculty: string[];
  enrollment: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  courses: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  grade: number;
}
