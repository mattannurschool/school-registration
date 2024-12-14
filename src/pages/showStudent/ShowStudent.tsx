// src/pages/ShowStudentsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StudentType } from "../../types/types";
import { deleteStudent, getStudentDetails } from "../../lib/appWrite";
import { FiUser, FiCalendar, FiBook, FiInfo } from "react-icons/fi";
import { SpinningCircles } from "react-loading-icons";

const ShowStudentsPage = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<StudentType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      if (!id) return;
      try {
        const response = await getStudentDetails(id);
        if (response) {
          setData({
            admissionNumber: response.admissionNumber || "N/A",
            studentName: response.studentName || "N/A",
            aadharNumber: response.aadharNumber || null,
            parentGuardianRel: response.parentGuardianRel || "N/A",
            parentOccResidence: response.parentOccResidence || "N/A",
            schoolPreviouslyStudied: response.schoolPreviouslyStudied || "N/A",
            dateOfAdmission: response.dateOfAdmission || null,
            dateOfBirth: response.dateOfBirth || null,
            religion: response.religion || "N/A",
            pupilCasteInfo: response.pupilCasteInfo || "N/A",
            standardOnAdmission: response.standardOnAdmission || "N/A",
            standardOnLeaving: response.standardOnLeaving || "N/A",
            dateOfLeaving: response.dateOfLeaving || null,
            tcNumberDate: response.tcNumberDate || "N/A",
            tcNumberDateLeaving: response.tcNumberDateLeaving || "N/A",
            reasonForLeaving: response.reasonForLeaving || "N/A",
            dateOfVaccination: response.dateOfVaccination || null,
            remarks: response.remarks || "N/A",
            avatar_url: response.avatar_url || "N/A",
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (id) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="justify-center flex ">
        <SpinningCircles fill="black" />
      </div>
    );
  }
  if (!data) {
    return <div className="text-center">No student data found.</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmed && id) {
      try {
        await deleteStudent(id);
        navigate("/?page=1&search=");
      } catch (error) {
        console.error("Error deleting student", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Student Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiUser className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <p>
            <strong>Name:</strong> {data.studentName}
          </p>
          <p>
            <strong>Admission Number:</strong> {data.admissionNumber}
          </p>
          <p>
            <strong>Aadhar Number:</strong> {data.aadharNumber || "N/A"}
          </p>
          <p>
            <strong>Guardian Name & Relationship:</strong>{" "}
            {data.parentGuardianRel}
          </p>
          <p>
            <strong>Guardian Occupation & Residence:</strong>{" "}
            {data.parentOccResidence}
          </p>
          <p>
            <strong>School Previously Studied:</strong>{" "}
            {data.schoolPreviouslyStudied}
          </p>
        </div>

        {/* Educational Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiCalendar className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Educational Information</h2>
          </div>
          <p>
            <strong>Date of Admission:</strong>{" "}
            {data.dateOfAdmission
              ? new Date(data.dateOfAdmission).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {data.dateOfBirth
              ? new Date(data.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Religion:</strong> {data.religion}
          </p>
          <p>
            <strong>Belongs to Scheduled Castes/Other:</strong>{" "}
            {data.pupilCasteInfo}
          </p>
        </div>

        {/* Class Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiBook className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Class Information</h2>
          </div>
          <p>
            <strong>Standard on Admission:</strong> {data.standardOnAdmission}
          </p>
          <p>
            <strong>Standard on Leaving:</strong> {data.standardOnLeaving}
          </p>
          <p>
            <strong>Date of Leaving:</strong>{" "}
            {data.dateOfLeaving
              ? new Date(data.dateOfLeaving).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>TC Produced on Admission:</strong> {data.tcNumberDate}
          </p>
          <p>
            <strong>TC Granted on Leaving:</strong> {data.tcNumberDateLeaving}
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiInfo className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Additional Information</h2>
          </div>
          <p>
            <strong>Reason for Leaving:</strong>{" "}
            {data.reasonForLeaving || "N/A"}
          </p>
          <p>
            <strong>Date of Vaccination:</strong>{" "}
            {data.dateOfVaccination
              ? new Date(data.dateOfVaccination).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Remarks:</strong> {data.remarks || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2 mt-3">
        <button
          className="btn !px-3 !py-1 !text-lg"
          onClick={() => navigate(`/create-edit-student/${id}`)}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn !px-3 !py-1 !text-lg !bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShowStudentsPage;
