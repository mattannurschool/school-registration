export interface StudentType {
  admissionNumber: string; // Optional field
  studentName: string; // Required field
  aadharNumber: string | null;
  parentGuardianRel: string | null;
  parentOccResidence: string | null;
  schoolPreviouslyStudied: string | null;
  dateOfAdmission: string | null;
  dateOfBirth: string | null; // Optional field
  religion: string; // Optional field
  pupilCasteInfo: string | null;
  standardOnAdmission: string | null;
  standardOnLeaving: string | null;
  dateOfLeaving: string | null;
  tcNumberDate: string | null;
  tcNumberDateLeaving: string | null;
  reasonForLeaving: string | null;
  dateOfVaccination: string | null;
  remarks: string | null;
  avatar_url: string; // Required field
  DOBInWords:string;
}
export type StudentFormData = Omit<StudentType, "avatar_url">;
