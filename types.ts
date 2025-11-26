
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
  imageUrl?: string;
}

export interface StudentResult {
  id: string;
  name: string; // Student's actual name
  studentName: string; // "School Name" fallback or context
  school: string;
  rollNumber: string;
  village: string;
  mobileNumber: string;
  score: number;
  totalQuestions: number;
  date: string;
  answers: Record<string, number>; // Question ID -> Selected Option Index
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  MODERATOR = 'MODERATOR',
  STUDENT_INTRO = 'STUDENT_INTRO',
  STUDENT_EXAM = 'STUDENT_EXAM',
  STUDENT_FORM = 'STUDENT_FORM',
  STUDENT_RESULT = 'STUDENT_RESULT',
}

export const MOCK_IMAGES = {
  LANDING_BG: "https://picsum.photos/id/20/1200/800", // "2nd for 1st page"
  STUDENT_INTRO: "https://picsum.photos/id/48/800/600", // "First picture... exam section"
  TEACHING_LOGO: "https://picsum.photos/id/4/200/200", // "Teaching.jpeg"
  PLACEHOLDER: "https://picsum.photos/400/300",
};
