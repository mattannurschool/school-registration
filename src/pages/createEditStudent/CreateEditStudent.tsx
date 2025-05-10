import React, { useEffect, useState } from "react";
import {
  createStudent,
  getStudentDetails,
  updateStudent,
} from "../../lib/appWrite";
import { useNavigate, useParams } from "react-router-dom";
import { StudentFormData } from "../../types/types";
import { SpinningCircles } from "react-loading-icons";

type datesKeyType = "dateOfAdmission" | "dateOfBirth";

const CreateEditStudentPage = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [fieldUpdated, setFIeldUpdated] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [formData, setFormData] = useState<StudentFormData>({
    studentName: "",
    admissionNumber: "",
    dateOfBirth: null,
    DOBInWords: "",
    religion: "",
    schoolPreviouslyStudied: "",
    aadharNumber: "",
    dateOfAdmission: "",
    dateOfLeaving: "",
    dateOfVaccination: "",
    parentGuardianRel: "",
    tcNumberDateLeaving: "",
    tcNumberDate: "",
    parentOccResidence: "",
    pupilCasteInfo: "",
    remarks: "",
    standardOnAdmission: "",
    standardOnLeaving: "",
    reasonForLeaving: "",
  });

  useEffect(() => {
    async function getUser() {
      if (!id) return;
      try {
        const response = await getStudentDetails(id);

        if (response) {
          const formattedAdmissionDate = response.dateOfAdmission
            ? new Date(response.dateOfAdmission).toISOString().split("T")[0]
            : null;
          const formattedDateOfBirth = response.dateOfBirth
            ? new Date(response.dateOfBirth).toISOString().split("T")[0]
            : null;

          setFormData({
            studentName: response.studentName || "",
            admissionNumber: response.admissionNumber || "",
            dateOfBirth: formattedDateOfBirth || null,
            DOBInWords: response.DOBInWords || "",
            religion: response.religion || "",
            schoolPreviouslyStudied: response.schoolPreviouslyStudied || "",
            aadharNumber: response.aadharNumber || null,
            parentGuardianRel: response.parentGuardianRel || null,
            parentOccResidence: response.parentOccResidence || null,
            dateOfAdmission: formattedAdmissionDate || null,
            pupilCasteInfo: response.pupilCasteInfo || null,
            standardOnAdmission: response.standardOnAdmission || null,
            standardOnLeaving: response.standardOnLeaving || null,
            dateOfLeaving: response.dateOfLeaving || null,
            tcNumberDate: response.tcNumberDate || null,
            tcNumberDateLeaving: response.tcNumberDateLeaving || null,
            dateOfVaccination: response.dateOfVaccination || null,
            remarks: response.remarks || null,
            reasonForLeaving: response.reasonForLeaving || null,
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }

    if (id) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFIeldUpdated(true);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDateToWords = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFIeldUpdated(true);

    // If dateOfBirth is changed, also update DOBInWords
    if (name === "dateOfBirth") {
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        DOBInWords: value ? formatDateToWords(value) : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addTimeToDate = () => {
    const keys = ["dateOfAdmission", "dateOfBirth"];

    let updatedDates: Partial<StudentFormData> = {};
    keys.forEach((name) => {
      const value = formData[name as keyof StudentFormData];
      if (value) {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        const finalDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds()
        );
        updatedDates[name as keyof StudentFormData] = finalDate.toISOString();
      } else {
        updatedDates[name as datesKeyType] = null;
      }
    });
    return { ...formData, ...updatedDates };
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fieldUpdated) {
      navigate("/?page=1&search=");
    }
    setButtonLoading(true);
    try {
      if (!id) {
        await createStudent(addTimeToDate());
      } else {
        await updateStudent(id, addTimeToDate());
      }
      setFormData({
        studentName: "",
        admissionNumber: "",
        dateOfBirth: null,
        DOBInWords: "",
        religion: "",
        schoolPreviouslyStudied: "",
        aadharNumber: "",
        dateOfAdmission: "",
        dateOfLeaving: "",
        dateOfVaccination: "",
        parentGuardianRel: "",
        tcNumberDateLeaving: "",
        tcNumberDate: "",
        parentOccResidence: "",
        pupilCasteInfo: "",
        remarks: "",
        standardOnAdmission: "",
        standardOnLeaving: "",
        reasonForLeaving: "",
      });
      setButtonLoading(false);
      navigate("/?page=1");
    } catch (error) {
      alert("Error adding student");
    }
  };

  return (
    <div className="background-fixed">
      <div className="max-w-[800px] w-full min-h-[100vh] mx-auto pt-10 px-4 ">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {id ? "Edit" : "Add"} New Student
          </h1>
          {isLoading && (
            <div className="justify-center flex ">
              <SpinningCircles fill="black" />
            </div>
          )}
          {!isLoading && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="admissionNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admission Number *
                </label>
                <input
                  type="text"
                  id="admissionNumber"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="aadharNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Aadhar Number
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="parentGuardianRel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name of Parent/Guardian & Relationship
                </label>
                <input
                  type="text"
                  id="parentGuardianRel"
                  name="parentGuardianRel"
                  value={formData.parentGuardianRel || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="parentOccResidence"
                  className="block text-sm font-medium text-gray-700"
                >
                  Occupation of Parent/Guardian & Residence
                </label>
                <input
                  type="text"
                  id="parentOccResidence"
                  name="parentOccResidence"
                  value={formData.parentOccResidence || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="schoolPreviouslyStudied"
                  className="block text-sm font-medium text-gray-700"
                >
                  School Previously Studied
                </label>
                <input
                  type="text"
                  id="schoolPreviouslyStudied"
                  name="schoolPreviouslyStudied"
                  value={formData.schoolPreviouslyStudied || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfAdmission"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Admission
                </label>
                <input
                  type="date"
                  id="dateOfAdmission"
                  name="dateOfAdmission"
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.dateOfAdmission || ""}
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.dateOfBirth || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="DOBInWords"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth (In Words)
                </label>
                <input
                  type="text"
                  id="DOBInWords"
                  name="DOBInWords"
                  value={formData.DOBInWords || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="religion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="pupilCasteInfo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Does the pupil belong to Scheduled Castes or Schedules Tribes
                  or other backward communities or is he a convert from
                  schedules Castes or Schedules Tribes
                </label>
                <input
                  type="text"
                  id="pupilCasteInfo"
                  name="pupilCasteInfo"
                  value={formData.pupilCasteInfo || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="standardOnAdmission"
                  className="block text-sm font-medium text-gray-700"
                >
                  Standard on Admission
                </label>
                <input
                  type="text"
                  id="standardOnAdmission"
                  name="standardOnAdmission"
                  value={formData.standardOnAdmission || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  Standard on Leaving
                </label>
                <input
                  type="text"
                  id="standardOnLeaving"
                  name="standardOnLeaving"
                  value={formData.standardOnLeaving || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Leaving
                </label>
                <input
                  type="date"
                  id="dateOfLeaving"
                  name="dateOfLeaving"
                  value={formData.dateOfLeaving || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  No. & date of TC produced on admission
                </label>
                <input
                  type="text"
                  id="tcNumberDate"
                  name="tcNumberDate"
                  value={formData.tcNumberDate || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  No. & date of TC granted on leaving
                </label>
                <input
                  type="text"
                  id="tcNumberDateLeaving"
                  name="tcNumberDateLeaving"
                  value={formData.tcNumberDateLeaving || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason for leaving
                </label>
                <input
                  type="text"
                  id="reasonForLeaving"
                  name="reasonForLeaving"
                  value={formData.reasonForLeaving || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of vaccination
                </label>
                <input
                  type="date"
                  id="dateOfVaccination"
                  name="dateOfVaccination"
                  value={formData.dateOfVaccination || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="standardOnLeaving"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remarks
                </label>
                <input
                  type="text"
                  id="remarks"
                  name="remarks"
                  value={formData.remarks || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="btn text-white !py-1 px-4 rounded-md shadow h-11"
              >
                {buttonLoading ? (
                  <div className="">
                    <span className="flex flex-1 justify-center">
                      <span className="dot animate-ping"></span>
                      <span className="dot animate-ping"></span>
                      <span className="dot animate-ping"></span>
                    </span>
                  </div>
                ) : id ? (
                  "Update Student"
                ) : (
                  "Add Student"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEditStudentPage;
