import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import { ApiResponse, TeacherGetDto } from "../../../constants/types";
import { useHistory } from "react-router-dom";
import "./teacher-listing.css";
import { baseUrl } from "../../../constants/base-url";

export const TeacherListingPage = () => {
    const history = useHistory();
    const [teachers, setTeachers] = useState<ApiResponse<TeacherGetDto[]>>();

    useEffect(() => {
        axios
            .get<ApiResponse<TeacherGetDto[]>>(`${baseUrl}/api/teachers`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                }

                setTeachers(response.data);
            });
    }, []);

    const teachersToShow = teachers?.data;

    return (
        <div className="teacher-page-container">

            <div className="teacher-page-title">
            <h1>Teachers</h1>
            </div>

            <div className="teacher-boxes">
                {teachersToShow && teachersToShow.map((x: TeacherGetDto) => {
                    return (
                        <div className="teacher-box-separating">

                        <div>
                            <Segment horizontal raised color="grey">
                                <p>
                                <div className="teacher-text-padding"><h3>{`${x.firstName} ${x.lastName}`}</h3></div>
                                <div className="teacher-text-padding">{`${x.email}`}</div>
                                <div className="teacher-text-padding">{`${x.phoneNumber}`}</div>
                                </p>
                                <Button color='blue' onClick={() => history.push(`/teachers/edit-teacher/${x.id}`)}>
                                    Edit
                                </Button>
                                <Button color='red' onClick={() => history.push(`/teachers/delete-teacher/${x.id}`)}>
                                    Delete
                                </Button>
                            </Segment>
                        </div>
                        
                        </div>
                    );
                })}

            <Segment horizontal raised circular>
            <div className = "teacher-newteach">
            <p>
              <h3>
                Add a new Teacher?
              </h3>
            </p>
          <Button color="green" type="submit" onClick={() => history.push(`/teachers/create`)}>
              +
            </Button>
            </div>
            </Segment>
            </div>
            </div>
    );
};


