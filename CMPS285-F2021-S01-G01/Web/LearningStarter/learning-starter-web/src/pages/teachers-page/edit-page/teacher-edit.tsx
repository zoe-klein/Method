import { useHistory, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./teacher-edit.css"
import { ApiResponse, TeacherGetDto, TeacherPutDto } from "../../../constants/types";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../../constants/base-url";
import React from "react";
import { Button, Label, Modal } from "semantic-ui-react";
import { routes } from "../../../routes/config";
import { Formik, Field, Form } from "formik";

type EditTeacherRequest = TeacherPutDto;

type EditTeacherResponse = ApiResponse<TeacherPutDto>;

type FormValues = EditTeacherRequest;

export const TeacherEditPage = () => {
    const history = useHistory();
    const [teacher, setTeacher] = useState<ApiResponse<TeacherGetDto>>();
    let { id } = useParams();

    const teacherData = teacher?.data;

    const initialValues = useMemo<FormValues>(
        () => ({
            id: id,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        }),
        [id]
    );

    if (teacherData !== undefined) {
        initialValues.firstName = teacherData.firstName;
        initialValues.lastName = teacherData.lastName;
        initialValues.email = teacherData.email;
        initialValues.phoneNumber = teacherData.phoneNumber;
    }

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

    const submitEdit = (values: EditTeacherRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.firstName = String(values.firstName);
        values.lastName = String(values.lastName);
        values.email = String(values.email);
        values.phoneNumber = String(values.phoneNumber);

        console.log("Values: ", values);

        axios
            .put<EditTeacherResponse>(`${baseUrl}/api/teachers/edit-teacher/${id}`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Edited Teacher");
                history.push(routes.teachers);
            })
            .catch(({ response, ...rest }: AxiosError<EditTeacherResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Editing Teacher");
                }
                console.log(rest.toJSON());
            });
    }

    function exampleReducer(state, action) {
        switch (action.type) {
            case 'OPEN_MODAL':
                return { open: true, dimmer: action.dimmer }
            case 'CLOSE_MODAL':
                return { open: false }
            default:
                throw new Error()
        }
    } //end function
    
    const [state, dispatch] = React.useReducer(exampleReducer, {
        open: false,
        dimmer: undefined,
    })
    const { open, dimmer } = state

    return(
        <div>

            <div className="edit-teacher-title">
            <h1>Edit Teacher</h1>
            </div>

            <div className="page-container-teachers">
                {teacherData && (
                <Formik initialValues={initialValues} onSubmit={submitEdit}>
                <Form>
                <div>

                    <div>
                        <div className="display-teachers-edit-info">
                            <Label size="large">New First Name</Label>
                        </div>
                            <Field id="firstName" name="firstName" />
                    </div>

                    <div>
                        <div className="display-teachers-edit-info">
                            <Label size="large">New Last Name</Label>
                        </div>
                            <Field id="lastName" name="lastName" />
                    </div>

                    <div>
                        <div className="display-teachers-edit-info">
                            <Label size="large">New Email</Label>
                        </div>
                            <Field id="email" name="email" />
                    </div>

                    <div>
                        <div className="display-teachers-edit-info">
                            <Label size="large">New Phone Number</Label>
                        </div>
                            <Field id="phoneNumber" name="phoneNumber" />
                    </div>

                        </div>

                        {/* buttons */}
                        <div className="button-for-teacher-edit">
                            <Button positive type="submit">Save Changes</Button>
                        </div>

                            </Form>
                        </Formik>
                        
                    )} 

                <Button color='red' onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                    Discard
                </Button>
                <Modal
                    dimmer={dimmer}
                    open={open}
                    onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                >
                <Modal.Header> Discard changes? </Modal.Header>
                <Modal.Content> Are you sure you would like to discard your changes? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => history.push(`/teachers`)}>
                        Discard
                    </Button>
                    <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                        Nevermind...
                    </Button>
                </Modal.Actions>
                </Modal>
                
            </div>
        </div>
    );
}
