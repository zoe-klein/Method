import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
//import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { ClassListing } from "../pages/classes-page/listing-page/class-listing";
import { ClassCreatePage } from "../pages/classes-page/create-page/class-create";
import { LectureListing } from "../pages/lectures-page/lecture-listing";
import { GetAllLectures } from "../pages/lectures-page/get-all-lectures";
import { LectureCreatePage } from "../pages/lectures-page/lecture-create";
import { LectureEditPage } from "../pages/lectures-page/lecture-edit";
import { TeacherListingPage } from "../pages/teachers-page/listing-page/teacher-listing";
import { TeacherCreatePage } from "../pages/teachers-page/create-page/teacher-create";
import { TeacherEditPage } from "../pages/teachers-page/edit-page/teacher-edit"; 
import { TeacherDeletePage } from "../pages/teachers-page/delete-page/teacher-delete";
import { NoteListing } from "../pages/notes-page/listing-page/note-listing";
import { NoteCreatePage } from "../pages/notes-page/create-page/note-create"
import { NoteListById } from "../pages/notes-page/listingById-page/note-listingById";
import { NoteEditPage } from "../pages/notes-page/edit-page/note-edit";
import { AssignmentListing } from "../pages/assignments-page/listing-page/assignment-listing";
import { AssignmentCreatePage } from "../pages/assignments-page/create-page/assignment-create";
import { AssignmentListById } from "../pages/assignments-page/listingById-page/assignment-listById";
import { AssignmentEditById } from "../pages/assignments-page/edit-page/assignment-edit";
import { RoomListingPage } from "../pages/rooms-page/listing-page/room-listing";
import { RoomCreatePage } from "../pages/rooms-page/create-page/room-create";
import { RoomEditPage } from "../pages/rooms-page/edit-page/room-edit";
import { RoomDeletePage } from "../pages/rooms-page/delete-page/room-delete";
import { RoomListById } from "../pages/rooms-page/listingById-page/room-listById";
import { BuildingListingPage } from "../pages/buildings-page/listing-page/building-listing";
import { BuildingCreatePage } from "../pages/buildings-page/create-page/building-create";
import { BuildingEditPage } from "../pages/buildings-page/edit-page/building-edit";
import { BuildingDeletePage } from "../pages/buildings-page/delete-page/building-delete";
import { BuildingListById } from "../pages/buildings-page/listingById-page/building-listById";
import { Grid } from "semantic-ui-react";

//This is where you will declare all of your routes (the ones that show up in the search bar)
export const routes = {
  root: `/`,
  home: `/home`,
  user: `/user`,
  classes: `/classes`,
  classesCreate: `/classes/create`,
  getAllLectures: `/lectures`,
  lectureListing: `/lectures/:id`,
  createLecture: `/lectures/create-lecture`,
  editLecture: `/lectures/lecture-edit/:id`,
  teachers: `/teachers`,
  teachersCreate: `/teachers/create`,
  teachersEdit: `/teachers/edit-teacher/:id`,
  teachersDelete: `/teachers/delete-teacher/:id`,
  notes: `/notes`,
  notesCreate: `/notes/create`,
  noteById: `/notes/:id`,
  noteEdit: `/notes/edit/:id`,
  assignments: `/assignments`,
  assignmentsCreate: `/assignments/assignments-create`,
  assignmentListById: `/assignments/:id`,
  assignmentsEdit: `/assignments/assignments-edit/:id`,
  rooms: `/rooms`,
  roomsCreate: `/rooms/create`,
  roomsEdit: `/rooms/edit-room/:id`,
  roomsDelete: `/rooms/delete-room/:id`,
  roomListById: `/rooms/get-room/:id`,
  buildings: `/buildings`,
  buildingsCreate: `/buildings/create`,
  buildingsEdit: `/buildings/edit-building/:id`,
  buildingsDelete: `/buildings/delete-building/:id`,
  buildingListById: `/buildings/get-building/:id`
};

//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} exact>
            <GetAllLectures />
          </Route>
          {/* When path === /iser render UserPage */}
          <Route path={routes.user} exact>
            <UserPage />
          </Route>
          <Route path={routes.createLecture} exact>
            <LectureCreatePage />
          </Route>
          <Route path={routes.getAllLectures} exact>
            <GetAllLectures />
          </Route>
          <Route path={routes.lectureListing} exact>
            <div> <LectureListing /> </div>
            <div>
              <Grid columns={2} relaxed='very'>
                <Grid.Column>
                  <p>
                    <NoteListing />
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    <AssignmentListing />
                  </p>
                </Grid.Column>
              </Grid>
            </div>
          </Route>
          <Route path={routes.editLecture} exact>
            <LectureEditPage />
          </Route>
          <Route path={routes.classes} exact>
            <ClassListing />
          </Route>
          <Route path={routes.classesCreate} exact>
            <ClassCreatePage />
          </Route>
          <Route path={routes.teachers} exact>
            <TeacherListingPage />
          </Route>
          <Route path={routes.teachersCreate} exact>
            <TeacherCreatePage />
          </Route>
          <Route path={routes.teachersEdit} exact>
            <TeacherEditPage />
          </Route>
          <Route path={routes.teachersDelete} exact>
            <TeacherDeletePage />
          </Route>
          {/*}
          <Route path={routes.notes} exact>
            <NoteListing />
          </Route>
          */}
          <Route path={routes.notesCreate} exact>
            <NoteCreatePage />
          </Route>
          <Route path={routes.noteById} exact>
            <NoteListById />
          </Route>
          <Route path={routes.noteEdit} exact>
            <NoteEditPage />
          </Route>
          {/* path for assignments
          <Route path={routes.assignments} exact>
            <AssignmentListing />
          </Route>
          */}
          {/* path for assignments create */}
          <Route path={routes.assignmentsCreate} exact>
            <AssignmentCreatePage />
          </Route>
          {/* path for list by Id*/}
          <Route path={routes.assignmentListById} exact>
            <AssignmentListById />
          </Route>
          {/* path for edit page */}
          <Route path={routes.assignmentsEdit} exact>
            <AssignmentEditById/>
          </Route>
          <Route path={routes.rooms} exact>
            <RoomListingPage />
          </Route>
          <Route path={routes.roomListById} exact>
            <RoomListById />
          </Route>
          <Route path={routes.roomsCreate} exact>
            <RoomCreatePage />
          </Route>
          <Route path={routes.roomsEdit} exact>
            <RoomEditPage />
          </Route>
          <Route path={routes.roomsDelete} exact>
            <RoomDeletePage />
          </Route>
          <Route path={routes.buildings} exact>
            <BuildingListingPage />
          </Route>
          <Route path={routes.buildingListById} exact>
            <BuildingListById />
          </Route>
          <Route path={routes.buildingsCreate} exact>
            <BuildingCreatePage />
          </Route>
          <Route path={routes.buildingsEdit} exact>
            <BuildingEditPage />
          </Route>
          <Route path={routes.buildingsDelete} exact>
            <BuildingDeletePage />
          </Route>
          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} exact>
            <Redirect to={routes.home} />
          </Route>
          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" exact>
            <NotFoundPage />
          </Route>
        </Switch>
      </PageWrapper>
    </>
  );
};
