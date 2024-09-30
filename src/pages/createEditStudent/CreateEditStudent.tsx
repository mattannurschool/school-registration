import React, { useEffect, useState } from "react";
import {
  createStudent,
  getStudentDetails,
  updateStudent,
} from "../../lib/appWrite";
import { useNavigate, useParams } from "react-router-dom";
import { StudentFormData, StudentType } from "../../types/types";
import { SpinningCircles } from "react-loading-icons";

type datesKeyType = "admissionDate" | "dateOfBirth" | "vacatingDate";
const CreateEditStudentPage = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [fieldUpdated,setFIeldUpdated] = useState(false)
  const [buttonLoading,setButtonLoading] = useState(false)

  useEffect(() => {
    async function getUser() {
      if (!id) return;
      try {
        const response = await getStudentDetails(id);

        if (response) {
          const formattedAdmissionDate = response.admissionDate
            ? new Date(response.admissionDate).toISOString().split("T")[0]
            : null;
          const formattedDateOfBirth = response.dateOfBirth
            ? new Date(response.dateOfBirth).toISOString().split("T")[0]
            : null;
          const formattedVacatingDate = response.dateOfBirth
            ? new Date(response.vacatingDate).toISOString().split("T")[0]
            : null;
          setFormData({
            studentName: response.studentName || "",
            admissionRegister: response.admissionRegister || "",
            admissionNumber: response.admissionNumber || "",
            guardianName: response.guardianName || "",
            guardianJob: response.guardianJob || "",
            fatherName: response.fatherName || "",
            motherName: response.motherName || "",
            admissionDate: formattedAdmissionDate || null,
            dateOfBirth: formattedDateOfBirth || null,
            caste: response.caste || "",
            casteCategory: response.casteCategory || "",
            religion: response.religion || "",
            admissionStartClass: response.admissionStartClass || "",
            vacatingClass: response.vacatingClass || "",
            vacatingDate: formattedVacatingDate || null,
            tcNumber: response.tcNumber || "",
            reason: response.reason || "",
            otherInfo: response.otherInfo || "",
            dateOfBirthInWords: response.dateOfBirthInWords|| ""// Add this line
          });
          setIsLoading(false);
        }
      } catch (error) {}
    }
    if (id) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, []);
  const [formData, setFormData] = useState<StudentFormData>({
    studentName: "",
    admissionRegister: "",
    admissionNumber: "",
    guardianName: "",
    guardianJob: "",
    fatherName: "",
    motherName: "",
    admissionDate: null,
    dateOfBirth: null,
    caste: "",
    casteCategory: "",
    religion: "",
    admissionStartClass: "",
    vacatingClass: "",
    vacatingDate: null,
    tcNumber: "",
    reason: "",
    otherInfo: "",
    dateOfBirthInWords:""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFIeldUpdated(true)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Convert to ISO string for Appwrite's datetime format
    }));
    // if (value) {
    //   const selectedDate = new Date(value);
    //   const currentDate = new Date();
    //   // Combine the selected date with the current time
    //   const finalDate = new Date(
    //     selectedDate.getFullYear(),
    //     selectedDate.getMonth(),
    //     selectedDate.getDate(),
    //     currentDate.getHours(),
    //     currentDate.getMinutes(),
    //     currentDate.getSeconds()
    //   );

    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: finalDate.toISOString(), // Convert to ISO string for Appwrite's datetime format
    //   }));
    // } else {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: null, // Set to null when no date is selected
    //   }));
    // }
  };

  const addTimeToDate = () => {
    const keys = ["admissionDate", "dateOfBirth", "vacatingDate"];

    let updatedDates: Partial<StudentFormData> = {};
    keys.forEach((name, idx) => {
      const value = formData[name as keyof StudentFormData];
      if (value) {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        // Combine the selected date with the current time
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
    if(!fieldUpdated){
      navigate("/?page=1&search=");
    }
    setButtonLoading(true)
    try {
      if (!id) {
        await createStudent(addTimeToDate());
      } else {
        await updateStudent(id, addTimeToDate());
      }
    setFormData({
      studentName: "",
      admissionRegister: "",
      admissionNumber: "",
      guardianName: "",
      guardianJob: "",
      fatherName: "",
      motherName: "",
      admissionDate: null,
      dateOfBirth: null,
      caste: "",
      casteCategory: "",
      religion: "",
      admissionStartClass: "",
      vacatingClass: "",
      vacatingDate: null,
      tcNumber: "",
      reason: "",
      otherInfo: "",
      dateOfBirthInWords: "", // Reset the new field
    });
    setButtonLoading(true);
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
                  htmlFor="admissionRegister"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admission Register
                </label>
                <input
                  type="text"
                  id="admissionRegister"
                  name="admissionRegister"
                  value={formData.admissionRegister}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
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
                  htmlFor="guardianName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Guardian name
                </label>
                <input
                  type="text"
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="guardianJob"
                  className="block text-sm font-medium text-gray-700"
                >
                  Guardian's Job
                </label>
                <input
                  type="text"
                  id="guardianJob"
                  name="guardianJob"
                  value={formData.guardianJob}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="fatherName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Father's Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="motherName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mother's Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admissionDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admission Date
                </label>
                <input
                  type="date"
                  id="admissionDate"
                  name="admissionDate"
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.admissionDate!}
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
                  value={formData.dateOfBirth!}
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfBirthInWords"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth in Words
                </label>
                <input
                  type="text"
                  id="dateOfBirthInWords"
                  name="dateOfBirthInWords"
                  value={formData.dateOfBirthInWords!}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="caste"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caste
                </label>
                <input
                  type="text"
                  id="caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="casteCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caste Category
                </label>
                <input
                  type="text"
                  id="casteCategory"
                  name="casteCategory"
                  value={formData.casteCategory || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  value={formData.religion}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admissionStartClass"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admission Start Class
                </label>
                <input
                  type="text"
                  id="admissionStartClass"
                  name="admissionStartClass"
                  value={formData.admissionStartClass || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="vacatingClass"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vacated class
                </label>
                <input
                  type="text"
                  id="vacatingClass"
                  name="vacatingClass"
                  value={formData.vacatingClass || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vacated Date
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.dateOfBirth!}
                />
              </div>
              <div>
                <label
                  htmlFor="tcNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  TC number
                </label>
                <input
                  type="text"
                  id="tcNumber"
                  name="tcNumber"
                  value={formData.tcNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleChange}
                  rows={4} // Set the number of rows for the textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="otherInfo"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Other Information
                </label>
                <textarea
                  id="otherInfo"
                  name="otherInfo"
                  value={formData.otherInfo || ""}
                  onChange={handleChange}
                  rows={4} // Set the number of rows for the textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Add the rest of the fields following the same pattern */}
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
