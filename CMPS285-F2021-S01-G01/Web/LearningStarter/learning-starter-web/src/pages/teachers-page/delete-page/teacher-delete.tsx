import axios, { AxiosError } from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label, Segment } from "semantic-ui-react";
import { baseUrl } from "../../../constants/base-url";
import { ApiResponse, TeacherGetDto } from "../../../constants/types";
import { routes } from "../../../routes/config";
import "./teacher-delete.css";

type DeleteTeacherResponse = ApiResponse<TeacherGetDto>;

export const TeacherDeletePage = () => {
    const history = useHistory();
    const [teacher, setTeacher] = useState<ApiResponse<TeacherGetDto>>();
    let { id } = useParams();

    useEffect(() => {
        axios
            .get<ApiResponse<TeacherGetDto>>(`${baseUrl}/api/teachers/get-teacher/${id}`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                }
                setTeacher(response.data);
            });
    }, [id]);

    const teacherData = teacher?.data;

    const submitDelete = () => {
        if (baseUrl === undefined) {
            return;
        }

        axios
            .delete<DeleteTeacherResponse>(`${baseUrl}/api/teachers/delete-teacher/${id}`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Deleted Teacher");
                history.push(routes.teachers);
            })
            .catch(({ response, ...rest }: AxiosError<DeleteTeacherResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Deleting Teacher");
                }
                console.log(rest.toJSON());
            });
    }
    
    return (
        <div>

            <div className="edit-teacher-page-title">
            <h1>Delete Teacher</h1>
            </div>

            <div className="flex-box-centered-content-delete-teacher">
                {teacherData && (
                <Formik initialValues={id} onSubmit={submitDelete}>
                    <Form>
                        <div className="field-delete-teacher-data">

                            <Segment raised color="red">
                                <div>
                                    <div className="old-teacher-data">
                                        <div>
                                            <div>
                                                <Label size="large">First Name</Label>
                                            </div>
                                            <div>
                                                {teacherData.firstName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="old-teacher-data">
                                        <div className="old-lastname">
                                            <div>
                                                <Label size="large">Last Name</Label>
                                            </div>
                                            <div>
                                                {teacherData.lastName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="old-teacher-data">
                                        <div className="old-email">
                                            <div>
                                                <Label size="large">Email</Label>
                                            </div>
                                            <div>
                                                {teacherData.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="old-teacher-data">
                                        <div className="old-phonenumber">
                                            <div>
                                                <Label size="large">Phone Number</Label>
                                            </div>
                                            <div >
                                                {teacherData.phoneNumber}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="confirm">Are you sure you want to delete this teacher?</p>

                                    <div className="button-container-teacher">
                                        <Button negative fluid type="submit">Delete</Button>
                                        <Button fluid onClick={() => history.push("/teachers")}>Nevermind...</Button>
                                    </div>

                                </div>
                            </Segment>

                        </div>
                    </Form>
                </Formik>
                )}
            </div>
        </div>
    );
}