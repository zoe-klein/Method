import { ApiResponse, LectureGetDto, LecturePutDto } from "../../constants/types";
import "./lecture-edit.css";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../constants/base-url";
import React from "react";
import { Button, Header, Label, Modal } from "semantic-ui-react";
import { Formik, Field, Form } from "formik";

type EditLectureRequest = LecturePutDto;

type EditLectureResponse = ApiResponse<LecturePutDto>;

type FormValues = EditLectureRequest;

export const LectureEditPage = () => {
    const history = useHistory();
    const [lecture, setLecture] = useState<ApiResponse<LectureGetDto>>();
    let { id } = useParams();

    const lectureData = lecture?.data;

    useEffect(() => {
        axios
        .get<ApiResponse<LectureGetDto>>(`${baseUrl}/api/lectures/${id}`)
        .then((response) => {
            if (response.data.hasErrors) {
                response.data.errors.forEach((err) => {
                    console.error(`${err.property}: ${err.message}`);
                });
            }
            setLecture(response.data);
        });
    }, [id]);

    const initialValues = useMemo<FormValues>(
        () => ({
            id: id,
            lectureName: "",
            sectionNumber: 0,
            classTime: new Date(),
            roomId: 0,
            teacherId: 0,
        }),
        [id]
    );

    if (lectureData !== undefined) {
        initialValues.lectureName = lectureData.lectureName;
        initialValues.sectionNumber = lectureData.sectionNumber;
        initialValues.roomId = lectureData.roomId;
        initialValues.teacherId = lectureData.teacherId;
    }

    const submitEdit = (values: EditLectureRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.lectureName = String(values.lectureName);
        values.sectionNumber = Number(values.sectionNumber);
        values.classTime = new Date(values.classTime);
        values.roomId = Number(values.roomId);
        values.teacherId = Number(values.teacherId);

        axios
        .put<EditLectureResponse>(`${baseUrl}/api/lectures/edit-lecture/${id}`, values)
        .then((response) => {
            if (response.data.hasErrors) {
                response.data.errors.forEach((err) => {
                    console.error(`${err.property}: ${err.message}`);
                });
                alert("Error");
                return;
            }

            history.goBack();
        })
        .catch(({ response, ...rest }: AxiosError<EditLectureResponse>) => {
            if (response?.data.hasErrors) {
                response.data.errors.forEach((err) => {
                    console.log(err.message);
                });
                alert(response.data.errors[0].message); 
            } else {
                alert("Error Editing Lecture");
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

    return (
        <div className="page-container">

            <div className="header-format">

                <Header>Edit Lecture</Header>

            </div>  

            <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                    <Formik initialValues={initialValues} onSubmit={submitEdit}>
                        <Form>
                                <div>
                                    <div>
                                        <div>
                                            <div  className="flex-box-center-aligned-content-lecture-listing">
                                                <div className="field-label">
                                                    <Label htmlFor="lectureName">New Lecture Name</Label>
                                                </div>
                                                <Field className="field" id="lectureName" name="lectureName" />
                                            </div>
                                            <div  className="flex-box-center-aligned-content-lecture-listing">
                                                <div className="field-label">
                                                    <Label htmlFor="sectionNumber">New Section Number</Label>
                                                </div>
                                                <Field className="field" type="number" id="sectionNumber" name="sectionNumber" />
                                            </div>
                                            <div  className="flex-box-center-aligned-content-lecture-listing">
                                                <div className="field-label">
                                                     <Label htmlFor="classTime">New Class Time</Label>
                                                </div>
                                                <Field type="date" id="classTime" name="classTime" />
                                            </div>
                                            <div  className="flex-box-center-aligned-content-lecture-listing">
                                                <div className="field-label">
                                                    <Label htmlFor="roomId">New Room Id</Label>
                                                </div>
                                                <Field className="field" type="number" id="roomId" name="roomId" />
                                            </div>
                                            <div  className="flex-box-center-aligned-content-lecture-listing">
                                                <div className="field-label">
                                                    <Label htmlFor="teacherId">New Teacher Id</Label>
                                                </div>
                                                <Field className="field" type="number" id="teacherId" name="teacherId" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className="button-container">
                                <Button positive className="button-container" type="submit">Submit</Button>
                            </div>
                        </Form>
                    </Formik>
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
                    <Button negative onClick={() => history.push(`/lectures/${id}`)}>
                        Yes
                    </Button>
                    <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                        Nevermind...
                    </Button>
                    </Modal.Actions>
                    </Modal>

                    </div>
            </div>

        </div>
        ) 
};