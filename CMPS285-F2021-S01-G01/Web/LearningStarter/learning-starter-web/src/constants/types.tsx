//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: Error[];
  hasErrors: boolean;
};

export type Error = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type User = {
  firstName: string;
  lastName: string;
  userName: string;
};

export type UserLecture = {
  userId: number,
  user: User,
  lectureId: number,
  lecture: Lecture,
};

export type Lecture = {
  lectureName: string,
  sectionNumber: number,
  classTime: Date,
};

export type ClassDto = {
  id: number;
  capacity: number;
  subject: string;
  userId: number;
  user: User;
};

export type LectureGetDto = {
  id: number;
  lectureName: string;
  sectionNumber: number;
  classTime: Date;
  roomId: number;
  teacherId: number;
};

export type LectureCreateDto = {
  lectureName: string;
  sectionNumber: number;
  classTime: Date;
  roomId: number;
  teacherId: number;
};

export type LecturePutDto = {
  lectureName: string;
  sectionNumber: number;
  classTime: Date;
  roomId: number;
  teacherId: number;
};
export type TeacherPostDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type TeacherGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type TeacherPutDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; 
};

export type NoteGetDto = {
  id: number;
  title: string;
  dateCreated: Date;
  content: string;
  UserLectureId: number;
};

export type NoteCreateDto = {
  title: string;
  dateCreated: Date;
  content: string;
  userLectureId: number;
};

export type NoteEditDto = {
  id: number;
  title: string;
  content: string;
  userLectureId: number;
};

//may or may not need this but here just in case
export type AssignmentDto = {
  id: number;
  name: string;
  dueDate: Date;
  score: number;
  description: string;
};

export type AssignmentGetDto = {
  id: number;
  name: string;
  dueDate: Date;
  score: number;
  description: string;
};

export type AssignmentCreateDto = {
  name: string;
  dueDate: Date;
  score: number;
  description: string;
};

export type AssignmentEditDto = {
  name: string;
  dueDate: Date;
  score: number;
  description: string;
};

export type RoomCreateDto = {
  roomNumber: number;
  buildingId: number;
};

export type RoomGetDto = {
  id: number;
  roomNumber: number;
  buildingId: number;
};

export type RoomEditDto = {
  id: number;
  roomNumber: number;
  buildingId: number;
};

export type BuildingCreateDto = {
  buildingName: string;
};

export type BuildingGetDto = {
  id: number;
  buildingName: string;
};

export type BuildingEditDto = {
  id: number;
  buildingName: string;
};
