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
            studentName: response.studentName || "N/A",
            admissionRegister: response.admissionRegister || "N/A",
            admissionNumber: response.admissionNumber || "N/A",
            guardianName: response.guardianName || "N/A",
            guardianJob: response.guardianJob || "N/A",
            fatherName: response.fatherName || "N/A",
            motherName: response.motherName || "N/A",
            admissionDate: response.admissionDate || null,
            dateOfBirth: response.dateOfBirth || null,
            caste: response.caste || "N/A",
            casteCategory: response.casteCategory || "N/A",
            religion: response.religion || "N/A",
            admissionStartClass: response.admissionStartClass || "N/A",
            vacatingClass: response.vacatingClass || "N/A",
            vacatingDate: response.vacatingDate || null,
            tcNumber: response.tcNumber || "N/A",
            reason: response.reason || "N/A",
            otherInfo: response.otherInfo || "N/A",
            avatar_url: response.avatar_url,
            dateOfBirthInWords: response.dateOfBirthInWords || "N/A",
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
        navigate('/?page=1&search=')
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiUser className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <p>
            <strong>Name:</strong> {data.studentName}
          </p>
          <p>
            <strong>Admission Register:</strong> {data.admissionRegister}
          </p>
          <p>
            <strong>Admission Number:</strong> {data.admissionNumber}
          </p>
          <p>
            <strong>Guardian Name:</strong> {data.guardianName}
          </p>
          <p>
            <strong>Guardian Job:</strong> {data.guardianJob}
          </p>
          <p>
            <strong>Father's Name:</strong> {data.fatherName}
          </p>
          <p>
            <strong>Mother's Name:</strong> {data.motherName}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiCalendar className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Educational Information</h2>
          </div>
          <p>
            <strong>Admission Date:</strong>{" "}
            {data.admissionDate
              ? new Date(data.admissionDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {data.dateOfBirth
              ? new Date(data.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Date of Birth in word:</strong>{" "}
            {data.dateOfBirthInWords
}
          </p>
          <p>
            <strong>Caste:</strong> {data.caste}
          </p>
          <p>
            <strong>Caste Category:</strong> {data.casteCategory || "N/A"}
          </p>
          <p>
            <strong>Religion:</strong> {data.religion}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiBook className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Class Information</h2>
          </div>
          <p>
            <strong>Admission Start Class:</strong>{" "}
            {data.admissionStartClass || "N/A"}
          </p>
          <p>
            <strong>Vacating Class:</strong> {data.vacatingClass || "N/A"}
          </p>
          <p>
            <strong>Vacating Date:</strong>{" "}
            {data.vacatingDate
              ? new Date(data.vacatingDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>TC Number:</strong> {data.tcNumber || "N/A"}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2 transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <FiInfo className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Additional Information</h2>
          </div>
          <p>
            <strong>Reason:</strong> {data.reason || "N/A"}
          </p>
          <p>
            <strong>Other Info:</strong> {data.otherInfo || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-3">
        <button
          className="btn !px-3 !py-1 !text-lg "
          onClick={() => navigate(`/create-edit-student/${id}`)}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete()}
          className="btn !px-3 !py-1 !text-lg !bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShowStudentsPage;
