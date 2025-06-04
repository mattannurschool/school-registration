import * as jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StudentType } from "../types/types";
import "../fonts/NotoSansMalayalam";
// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportStudentsTable = async (students: any[]) => {
  const doc = new jsPDF.default();
  doc.addFont("NotoSansMalayalam-Regular.ttf", "NotoSansMalayalam", "normal");
  doc.setFont("NotoSansMalayalam-Regular");
  // Add title
  doc.setFontSize(16);
  doc.text("Students List", 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  // Prepare table data
  const tableData = students.map((student, index) => [
    index + 1,
    student.admissionNumber || "N/A",
    student.studentName || "N/A",
    student.dateOfAdmission
      ? new Date(student.dateOfAdmission).toLocaleDateString()
      : "N/A",
  ]);

  // Generate table
  autoTable(doc, {
    head: [["SL No", "Admission Number", "Full Name", "Date of Admission"]],
    body: tableData,
    startY: 30,
    styles: { font: "NotoSansMalayalam-Regular", fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Save the PDF
  doc.save("students-list.pdf");
};

export const exportStudentDetails = async (student: StudentType) => {
  const doc = new jsPDF.default();
  doc.addFont("NotoSansMalayalam-normal.ttf", "NotoSansMalayalam", "normal");
  doc.setFont("NotoSansMalayalam-Regular");

  // Add title
  doc.setFontSize(16);
  doc.text("Student Details", 14, 15);

  // Add student name
  doc.setFontSize(14);
  doc.text(student.studentName, 14, 25);

  // Add admission number
  doc.setFontSize(12);
  doc.text(`Admission Number: ${student.admissionNumber}`, 14, 35);

  // Personal Information
  doc.setFontSize(14);
  doc.text("Personal Information", 14, 45);
  doc.setFontSize(10);
  doc.text(`Aadhar Number: ${student.aadharNumber || "N/A"}`, 14, 55);
  doc.text(
    `Guardian Name & Relationship: ${student.parentGuardianRel}`,
    14,
    62
  );
  doc.text(
    `Guardian Occupation & Residence: ${student.parentOccResidence}`,
    14,
    69
  );
  doc.text(
    `School Previously Studied: ${student.schoolPreviouslyStudied}`,
    14,
    76
  );

  // Educational Information
  doc.setFontSize(14);
  doc.text("Educational Information", 14, 90);
  doc.setFontSize(10);
  doc.text(
    `Date of Admission: ${
      student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toLocaleDateString()
        : "N/A"
    }`,
    14,
    100
  );
  doc.text(
    `Date of Birth: ${
      student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "N/A"
    }`,
    14,
    107
  );
  doc.text(`Religion: ${student.religion}`, 14, 114);
  doc.text(
    `Belongs to Scheduled Castes/Other: ${student.pupilCasteInfo}`,
    14,
    121
  );

  // Class Information
  doc.setFontSize(14);
  doc.text("Class Information", 14, 135);
  doc.setFontSize(10);
  doc.text(`Standard on Admission: ${student.standardOnAdmission}`, 14, 145);
  doc.text(`Standard on Leaving: ${student.standardOnLeaving}`, 14, 152);
  doc.text(
    `Date of Leaving: ${
      student.dateOfLeaving
        ? new Date(student.dateOfLeaving).toLocaleDateString()
        : "N/A"
    }`,
    14,
    159
  );
  doc.text(`TC Produced on Admission: ${student.tcNumberDate}`, 14, 166);
  doc.text(`TC Granted on Leaving: ${student.tcNumberDateLeaving}`, 14, 173);

  // Additional Information
  doc.setFontSize(14);
  doc.text("Additional Information", 14, 187);
  doc.setFontSize(10);
  doc.text(`Reason for Leaving: ${student.reasonForLeaving || "N/A"}`, 14, 197);
  doc.text(
    `Date of Vaccination: ${
      student.dateOfVaccination
        ? new Date(student.dateOfVaccination).toLocaleDateString()
        : "N/A"
    }`,
    14,
    204
  );
  doc.text(`Remarks: ${student.remarks || "N/A"}`, 14, 211);

  // Save the PDF
  doc.save(`student-${student.admissionNumber}-details.pdf`);
};

export const exportStudentDetailsWithLetterhead = async (
  student: StudentType
) => {
  const doc = new jsPDF.default();
  doc.setFont("NotoSansMalayalam-Regular");

  // Letterhead (school info, contact, etc.)
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text("Madhusoodanan Thangal Smaraka Govt U P School Mattanur", 105, 15, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Mattanur, Kannur, Kerala, PIN: 670702", 105, 22, {
    align: "center",
  });
  doc.text("gupsmttr@gmail.com , School Code : 14755", 105, 27, {
    align: "center",
  });
  doc.text("\u260E 04902474545", 200, 15, { align: "right" });
  doc.line(10, 32, 200, 32);

  // Title
  doc.setFontSize(13);
  doc.setFont("NotoSansMalayalam-Bold");
  doc.text("ADMISSION EXTRACT", 105, 40, { align: "center" });
  doc.setFont("NotoSansMalayalam-Regular");

  // Details
  let y = 50;
  const details = [
    ["1) Admission No", student.admissionNumber],
    ["2) Name", student.studentName],
    ["3) Name Of Parent/Guardian", student.parentGuardianRel],
    ["4) Relationship Of The Pupil To Guardian", ""],
    ["5) Occupation Of Parent/Guardian", student.parentOccResidence],
    ["6) School Previously Attended", student.schoolPreviouslyStudied],
    [
      "7) Date Of Admission",
      student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toLocaleDateString()
        : "",
    ],
    [
      "8) Date Of Birth",
      student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "",
    ],
    ["9) Religion & Caste", student.religion],
    ["10) SC/ST Or OBC", student.pupilCasteInfo],
    ["11) Standard On Admission", student.standardOnAdmission],
    ["12) Standard On Leaving", student.standardOnLeaving || "Now Studying"],
    ["13) No & Date Of TC Produced On Admission", student.tcNumberDate],
    ["14) No & Date Of TC Granted On Leaving", student.tcNumberDateLeaving],
    [
      "15) Date Of Vaccination",
      student.dateOfVaccination
        ? new Date(student.dateOfVaccination).toLocaleDateString()
        : "",
    ],
    ["16) Remarks", student.remarks],
  ];
  doc.setFontSize(11);
  details.forEach(([label, value]) => {
    const safeLabel =
      label !== undefined && label !== null ? String(label) : "";
    const safeValue =
      value !== undefined && value !== null ? String(value) : "";
    doc.text(safeLabel + " :", 10, Number(y));
    doc.text(safeValue, 98, Number(y));
    y += 7;
  });

  // Place, Date, Signature, Seal
  y += 10;
  doc.setFontSize(10);
  doc.text("Place:", 10, y);
  doc.text("Signature:", 150, y);
  y += 7;
  doc.text("Date:", 10, y);
  doc.text("Seal:", 150, y);

  // Footer
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 200, 290, {
    align: "right",
  });
  doc.save(`student-${student.admissionNumber}-details-letterhead.pdf`);
};

export const exportStudentDetailsWithoutLetterhead = async (
  student: StudentType
) => {
  const doc = new jsPDF.default();
  doc.setFont("NotoSansMalayalam-Regular");

  // Title
  doc.setFontSize(13);
  doc.setFont("NotoSansMalayalam-Bold");
  doc.text("ADMISSION EXTRACT", 105, 20, { align: "center" });
  doc.setFont("NotoSansMalayalam-Regular");

  // Details
  let y = 40;
  const details = [
    ["1) Admission No", student.admissionNumber],
    ["2) Name", student.studentName],
    ["3) Name Of Parent/Guardian", student.parentGuardianRel],
    ["4) Relationship Of The Pupil To Guardian", ""],
    ["5) Occupation Of Parent/Guardian", student.parentOccResidence],
    ["6) School Previously Attended", student.schoolPreviouslyStudied],
    [
      "7) Date Of Admission",
      student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toLocaleDateString()
        : "",
    ],
    [
      "8) Date Of Birth",
      student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "",
    ],
    ["9) Religion & Caste", student.religion],
    ["10) SC/ST Or OBC", student.pupilCasteInfo],
    ["11) Standard On Admission", student.standardOnAdmission],
    ["12) Standard On Leaving", student.standardOnLeaving || "Now Studying"],
    ["13) No & Date Of TC Produced On Admission", student.tcNumberDate],
    ["14) No & Date Of TC Granted On Leaving", student.tcNumberDateLeaving],
    [
      "15) Date Of Vaccination",
      student.dateOfVaccination
        ? new Date(student.dateOfVaccination).toLocaleDateString()
        : "",
    ],
    ["16) Remarks", student.remarks],
  ];
  doc.setFontSize(11);
  details.forEach(([label, value]) => {
    const safeLabel =
      label !== undefined && label !== null ? String(label) : "";
    const safeValue =
      value !== undefined && value !== null ? String(value) : "";
    doc.text(safeLabel + " :", 10, Number(y));
    doc.text(safeValue, 98, Number(y));
    y += 7;
  });

  // Footer
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 200, 290, {
    align: "right",
  });
  doc.save(`student-${student.admissionNumber}-details-letterhead.pdf`);
};

export const exportStudentDetailsOnStampPaper = async (
  student: StudentType
) => {
  const doc = new jsPDF.default();
  doc.setFont("NotoSansMalayalam-Regular");
  // Centered, more margin, maybe watermark (optional)
  doc.setFontSize(13);
  doc.setFont("NotoSansMalayalam-Bold");
  doc.text("ADMISSION EXTRACT", 105, 40, { align: "center" });
  doc.setFont("NotoSansMalayalam-Regular");
  let y = 55;
  const details = [
    ["1) Admission No", student.admissionNumber],
    ["2) Name", student.studentName],
    ["3) Name Of Parent/Guardian", student.parentGuardianRel],
    ["4) Relationship Of The Pupil To Guardian", ""],
    ["5) Occupation Of Parent/Guardian", student.parentOccResidence],
    ["6) School Previously Attended", student.schoolPreviouslyStudied],
    [
      "7) Date Of Admission",
      student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toLocaleDateString()
        : "",
    ],
    [
      "8) Date Of Birth",
      student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "",
    ],
    ["9) Religion & Caste", student.religion],
    ["10) SC/ST Or OBC", student.pupilCasteInfo],
    ["11) Standard On Admission", student.standardOnAdmission],
    ["12) Standard On Leaving", student.standardOnLeaving || "Now Studying"],
    ["13) No & Date Of TC Produced On Admission", student.tcNumberDate],
    ["14) No & Date Of TC Granted On Leaving", student.tcNumberDateLeaving],
    [
      "15) Date Of Vaccination",
      student.dateOfVaccination
        ? new Date(student.dateOfVaccination).toLocaleDateString()
        : "",
    ],
    ["16) Remarks", student.remarks],
  ];
  doc.setFontSize(11);
  details.forEach(([label, value]) => {
    const safeLabel =
      label !== undefined && label !== null ? String(label) : "";
    const safeValue =
      value !== undefined && value !== null ? String(value) : "";
    doc.text(safeLabel + " :", 40, Number(y));
    doc.text(safeValue, 110, Number(y));
    y += 7;
  });
  doc.save(`student-${student.admissionNumber}-details-stamppaper.pdf`);
};
