import "./teacher-create.css";
import "../listing-page/teacher-listing.css";
import { ApiResponse, TeacherPostDto } from "../../../constants/types";
import { useHistory } from "react-router-dom";
import { routes } from "../../../routes/config";
import { Formik, Form, Field } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";
import axios, { AxiosError } from "axios";
import React, { useMemo } from "react";
import { baseUrl } from "../../../constants/base-url";

type CreateTeacherRequest = TeacherPostDto;

type CreateTeacherResponse = ApiResponse<TeacherPostDto>;

type FormValues = CreateTeacherRequest;

export const TeacherCreatePage = () => {
    const history = useHistory();
    const initialValues = useMemo<FormValues>(
        () => ({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@url.com",
            phoneNumber: "X-XXX-XXX-XXXX",
        }),
        []
    );

    const submitCreate = (values: CreateTeacherRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.firstName = String(values.firstName);
        values.lastName = String(values.lastName);
        values.email = String(values.email);
        values.phoneNumber = String(values.phoneNumber);
        console.log("Values: ", values);
        
        axios
            .post<CreateTeacherResponse>(`${baseUrl}/api/teachers/create-teacher`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }
                console.log("Successfully Created Teacher");
                history.push(routes.teachers);
            })
            .catch(({ response, ...rest }: AxiosError<CreateTeacherResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Creating Teacher");
                }
                console.log(rest.toJSON());
            });    
    };

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

    return (
        <div className="page-container">
            <div className="create-page-title">
            <h1>Create Teacher</h1>
            </div>
            <div>
                    <Formik initialValues={initialValues} onSubmit={submitCreate}>
                        <Form>
                            
                                <div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">First Name</Label>
                                        </div>
                                        <Field id="firstName" name="firstName" />
                                    </div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">Last Name</Label>
                                        </div>
                                        <Field id="lastName" name="lastName" />
                                    </div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">Email</Label>
                                        </div>
                                        <Field id="email" name="email" />
                                    </div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">Phone Number</Label>
                                        </div>
                                        <Field id="phoneNumber" name="phoneNumber" />
                                    </div>

                                    {/* buttons */}
                                    <div className="button-for-create">
                                        <Button color='green' className="create-button" type="submit">
                                            Create
                                        </Button>

                                        
                                    </div>
                                </div>
                            
                        </Form>
                    </Formik>

                    <Button color='red' onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                      Cancel
                    </Button>

        
            <Modal
                dimmer={dimmer}
                open={open}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
            >
                <Modal.Header> Discard Teacher? </Modal.Header>
                <Modal.Content> Are you sure you would like to discard this teacher? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => history.push("/teachers")}>
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
};
