// src/services/appwriteService.ts
import { Client, Databases, Account, Avatars } from "appwrite";
import { ID, Query } from "appwrite";
import { StudentType } from "../types/types";

console.log(process.env.REACT_APP_APPWRITE_ENDPOINT);
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
    const noOfStudents = 30; // Number of students per page
    const offset = (page - 1) * noOfStudents;

    // Query by studentName
    const studentNameResponse = await database.listDocuments(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      [
        Query.contains("studentName", query),
        Query.orderDesc("$updatedAt"),
        Query.limit(noOfStudents),
      ]
    );

    // Query by admissionNumber
    const admissionNumberResponse = await database.listDocuments(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      [
        Query.contains("admissionNumber", query),
        Query.orderDesc("admissionDate"),
        Query.limit(noOfStudents),
      ]
    );

    // Combine both results and filter duplicates (by $id)
    const combinedResults = [
      ...studentNameResponse.documents,
      ...admissionNumberResponse.documents,
    ];

    // Use a Map to remove duplicates based on the document $id
    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item.$id, item])).values()
    );

    // Paginate the unique results (after filtering duplicates)
    const paginatedResults = uniqueResults.slice(offset, offset + noOfStudents);
    // Determine if there's a next page
    const hasNext = uniqueResults.length > offset + noOfStudents;
    return {
      documents: paginatedResults,
      hasNext,
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
      [
        
        
        Query.orderDesc("admissionDate"),
      ]
    );
  } catch (error) {
    console.error("Error searching students", error);
  }
};

export const getStudentDetails = async (studentId: string) => {
  try {
    return (await database.getDocument(
      STUDENTS_DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      studentId,

    ))
  } catch (error) {
    console.error("Error updating student", error);
  }
};
