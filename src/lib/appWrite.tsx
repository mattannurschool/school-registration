// src/services/appwriteService.ts
import { Client, Databases, Account, Avatars } from "appwrite";
import { ID, Query } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || "") // Set your Appwrite endpoint
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || "");

export const STUDENTS_DATABASE_ID =
  process.env.REACT_APP_STUDENTS_DATABASE_ID || "";
export const STUDENTS_COLLECTION_ID =
  process.env.REACT_APP_STUDENTS_COLLECTION_ID || "";

const account = new Account(client);
const database = new Databases(client);
export const avatars = new Avatars(client);

export const checkUserSession = async () => {
  try {
    const response = await account.get();
    return response;
  } catch (error) {
    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const createStudent = async (data: any) => {
  try {
    const id = ID.unique();
    const avatarUrl = avatars.getInitials(data.studentName);
    const newData = {
      ...data,
      avatar_url: avatarUrl,
    };
    console.log(newData);
    return await database.createDocument(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      id,
      newData
    );
  } catch (error) {
    console.error("Error creating student", error);
  }
};

export const getStudentsList = async (page = 1, query: string) => {
  try {
    const noOfStudents = 30;
    const offset = (page - 1) * noOfStudents;

    const filters = Query.or([
      Query.contains("studentName", query),
      Query.contains("admissionNumber", query),
    ]);

    const response = await database.listDocuments(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      [
        filters,
        Query.orderDesc("$updatedAt"), // You can choose the field to sort by
        Query.limit(100), // Fetch more to allow room for pagination
      ]
    );
    
    const uniqueDocs = Array.from(
      new Map(response.documents.map((doc) => [doc.$id, doc])).values()
    );

    const paginated = uniqueDocs.slice(offset, offset + noOfStudents);
    const hasNext = uniqueDocs.length > offset + noOfStudents;

    return {
      documents: paginated,
      hasNext,
      total: response.total
    };
  } catch (error) {
    console.error("Error fetching students list:", error);
    return null;
  }
};

export const updateStudent = async (studentId: string, data: any) => {
  try {
    return await database.updateDocument(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      studentId,
      data
    );
  } catch (error) {
    console.error("Error updating student", error);
  }
};

export const deleteStudent = async (studentId: string) => {
  try {
    return await database.deleteDocument(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      studentId
    );
  } catch (error) {
    console.error("Error deleting student", error);
  }
};

export const searchStudents = async (query: string) => {
  try {
    return await database.listDocuments(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      [Query.orderDesc("dateOfAdmission")]
    );
  } catch (error) {
    console.error("Error searching students", error);
  }
};

export const getStudentDetails = async (studentId: string) => {
  try {
    return await database.getDocument(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      studentId
    );
  } catch (error) {
    console.error("Error updating student", error);
  }
};
