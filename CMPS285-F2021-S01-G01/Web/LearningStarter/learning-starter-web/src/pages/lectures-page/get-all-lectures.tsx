import "./get-all-lectures.css";
import React, { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { ApiResponse, LectureGetDto } from "../../constants/types";
import axios from "axios";
import { baseUrl } from "../../constants/base-url";
import { useHistory } from "react-router-dom";
import { routes } from "../../routes/config";

export const GetAllLectures = () => {
  const [lectures, setLectures] = useState<ApiResponse<LectureGetDto[]>>();

  useEffect(() => {
    axios
      .get<ApiResponse<LectureGetDto[]>>(`${baseUrl}/api/lectures`)
      .then((response) => {
        if (response.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.error(`${err.property}: ${err.message}`);
          });
        }
        setLectures(response.data);
      });
    //This empty array is important to ensure this only runs once on page load
    //Otherwise this will cause an infinite loop since we are setting State
  }, []);

  //const implement of useHistory
  const history = useHistory();

  const lecturesToShow = lectures?.data;
  return (
    <div className="page-container">
      <div className="header-format">
        <div>
          <Header size="huge">Welcome to Method!</Header>
        </div>
      </div>
      <div className="flex-box-centered-content-class-listing">
        {lecturesToShow &&
          lecturesToShow.map((x: LectureGetDto) => {
            return (
              <div className="flex-row-fill-class-listing">
                <Segment horizontal raised color="grey">
                  <div> <Header>{`${x.lectureName}`}</Header></div>
                  <div>{`Section Number: ${x.sectionNumber}`}</div>
                  <div>{`Class Time: ${x.classTime}`}</div>
                  <div>{`Room Id: ${x.roomId}`}</div>
                  <div>{`Teacher Id: ${x.teacherId}`}</div>
                  <div>
                    <Button color="vk" onClick={() => history.push(`${routes.lectureListing.replace(":id", `${x.id}`)}`)}>
                      Go To
                    </Button>
                  </div>
                </Segment>
              </div>
            );
          })}
          <Segment horizontal raised circular>
                  <Header>Add New Lecture</Header>
                  <Button positive onClick={() => history.push(`${routes.createLecture}`)}>
                    +
                  </Button>
                </Segment>
      </div>
    </div>
  );
};
