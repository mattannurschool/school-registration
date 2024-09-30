export interface StudentType {
  studentName: string; // Required field
  avatar_url: string; // Required field
  admissionRegister: string; // Optional field
  admissionNumber: string; // Optional field
  guardianName: string; // Optional field
  guardianJob: string; // Optional field
  fatherName: string; // Optional field
  motherName: string; // Optional field
  admissionDate: string | null; // Optional field
  dateOfBirth: string | null; // Optional field
  caste: string; // Optional field
  casteCategory: string | null; // Optional field
  religion: string; // Optional field
  admissionStartClass: string | null; // Optional field
  vacatingClass: string | null; // Optional field
  vacatingDate: string | null; // Optional field
  tcNumber: string | null; // Optional field
  reason: string | null; // Optional field
  otherInfo: string | null; // Optional field
  dateOfBirthInWords:string|null
}
export type StudentFormData = Omit<StudentType, "avatar_url">;
