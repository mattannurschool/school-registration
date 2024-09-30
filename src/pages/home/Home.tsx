import React, { useEffect, useState } from "react";
import "./home.css";
import { deleteStudent, getStudentsList } from "../../lib/appWrite";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SpinningCircles } from "react-loading-icons";
import ConfirmModal from "../../components/confirmModal";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null); // Search term state
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  // Load page from query params or set default page=1
  useEffect(() => {
    console.log(searchParams.get("page"), searchParams.get("search"));
    const pageParam = searchParams.get("page") ?? 1;
    const search = searchParams.get("search") ?? "";
    const pageNumber = pageParam ? Number(pageParam) : 1;
    setSearchParams({ page: pageParam.toString(), search: search });

    setSearchTerm(search);
    setCurrentPage(pageNumber);
    setSearchQuery(search);
  }, [searchParams, setSearchParams]);
    useEffect(() => {
      async function getStudents() {
        setIsLoading(true);
        if (searchParams != null && currentPage != null) {
          const response = await getStudentsList(currentPage, searchTerm ?? ""); // Pass searchTerm to API
          if (response) {
            setStudents(response.documents);
            setHasNext(response.hasNext);
          }
          setIsLoading(false);
        }
      }
      getStudents();
    }, [currentPage, searchTerm]);

  // Handle delete operation
  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.$id !== studentToDelete)
        );
      } catch (error) {
        console.error("Error deleting student", error);
      }
      setIsModalOpen(false); // Close the modal
      setStudentToDelete(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setStudentToDelete(id);
    setIsModalOpen(true);
  };
  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    setSearchParams({ page: "1", search: searchQuery });
  };

  return (
    <div className="home-container background-fixed">
      <div className="max-w-[1200px] w-full min-h-[100vh] mx-auto pt-10 px-4">
        {/* SEARCH input */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or admission number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex flex-1 px-5 py-2 border border-gray-500 rounded-md outline-none text-lg bg-gray-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="btn !m-0 !hover:bg-none px-4 py-2 !bg-green-500"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="btn !m-0 !hover:bg-none  px-4 py-2"
            onClick={() => navigate("/create-edit-student")}
          >
            Add student
          </button>
        </div>

        {/* Student List */}
        <div className="mt-10 min-h-[20vh]">
          {students.length === 0 && !isLoading && (
            <div className="flex justify-center">No students found</div>
          )}
          {isLoading ? (
            <div className="justify-center flex ">
              <SpinningCircles fill="black" />
            </div>
          ) : (
            students.map((item) => (
              <div
                key={item.$id}
                className="flex flex-col sm:flex-row justify-between cursor-pointer p-4 hover:scale-[1.03] transition-all items-center mb-4 border border-gray-300 rounded-md bg-white"
              >
                <div
                  onClick={() => navigate(`students/${item.$id}`)}
                  className="flex flex-1 flex-row gap-3 items-center"
                >
                  <img
                    className="w-[80px] h-[80px] rounded-full max-sm:w-[40px] max-sm:h-[40px]"
                    src={item.avatar_url}
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div className="text-[#0056b3] text-lg font-semibold max-sm:text-sm">
                      {item.studentName}
                    </div>
                    <div className="text-gray-700 max-sm:text-sm">
                      Admission No: {item.admissionNumber || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex  flex-row gap-2 mt-2 sm:mt-0">
                  <button
                    className="btn !px-3 !py-1 !text-lg"
                    onClick={() => navigate(`/create-edit-student/${item.$id}`)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item.$id)}
                    className="btn !px-3 !py-1 !text-lg !bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading && students.length !== 0 && (
          <div className="flex justify-between flex-col sm:flex-row mb-10 mt-5 px-5 transition-all">
            {currentPage! > 1 ? (
              <button
                className="border-2 rounded-md border-black px-4 py-2 text-lg transition-all hover:bg-black hover:text-white mb-4 sm:mb-0"
                onClick={() =>
                  currentPage != null &&
                  searchTerm != null &&
                  navigate(`/?page=${currentPage - 1}&search=${searchTerm}`)
                }
              >
                Prev
              </button>
            ) : (
              <span></span>
            )}
            {hasNext ? (
              <button
                className="border-2 rounded-md border-black transition-all px-4 py-2 text-lg hover:bg-black hover:text-white"
                onClick={() =>
                  currentPage != null &&
                  searchTerm != null &&
                  navigate(`/?page=${currentPage + 1}&search=${searchTerm}`)
                }
              >
                Next
              </button>
            ) : (
              <span></span>
            )}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default HomePage;
