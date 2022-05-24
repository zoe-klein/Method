import React, { useEffect, useMemo, useState } from "react";
import { Button, Label } from "semantic-ui-react";
import { ApiResponse, NoteGetDto, NoteEditDto } from "../../../constants/types";
import { useHistory, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Field, Form, Formik } from "formik";

type EditNoteRequest = NoteEditDto;

type EditNoteResponse = ApiResponse<NoteEditDto>;

type FormValues = EditNoteRequest

export const NoteEditPage = () => {
    const history = useHistory();
    const [note, setNote] = useState<ApiResponse<NoteGetDto>>();
    let { id } = useParams();

    useEffect(() => {
        axios
            .get<ApiResponse<NoteGetDto>>(`${baseUrl}/api/notes/${id}`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                }
                setNote(response.data);
            });
    }, [id]);

    const noteData = note?.data;

    const initialValues = useMemo<FormValues>(
        () => ({
            id: id,
            title: "",
            content: "",
            userLectureId: 1,
        }),
        [id]
    );

    if (noteData !== undefined) {
        initialValues.title = noteData.title;
        initialValues.content = noteData.content;
        initialValues.userLectureId = noteData.UserLectureId;
    }

    const submitEdit = (values: EditNoteRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.title = String(values.title);
        values.content = String(values.content);
        values.userLectureId = Number(values.userLectureId);
        console.log("Values: ", values);

        axios
            .put<EditNoteResponse>(`${baseUrl}/api/notes/edit/${id}`, values)
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
            .catch(({ response, ...rest }: AxiosError<EditNoteResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Editing Note");
                }
                console.log(rest.toJSON());
            });
    }
    
    return (
        <div>
            <div className="create-note-form">
            {noteData && (
            <Formik initialValues={initialValues} onSubmit={submitEdit}>
                <Form>
                <div>
                    <div className="flex-box-centered-content-create-note">
                        <div>
                            <div className="field-label">
                                <Label id="title"> Title </Label>
                            </div>
                            <Field className="field" id="title" name="title" placeholder="new title..." />
                        </div>
                        <div>
                            <div className="field-label">
                                <Label id="userLectureId"> User Lecture Id </Label>
                            </div>
                            <Field type="number" id="userLectureId" name="userLectureId"/>
                        </div>
                    </div>
                    <div className = "create-note-textBox">
                        <div className = "field-label">
                            <Label id="content"> New Note </Label>
                        </div>
                        <Field as="textarea" id="content" name="content" rows="60" cols="170"/>
                    </div>
                </div>
                <div className="button-container-edit-note">
                    <Button color='green' className="edit-button" type="submit">
                        Save Changes
                    </Button>
                    <Button className="button-container-edit-note" onClick={() => history.push(`/notes/${id}`)}>
                        Discard
                    </Button>
                </div>
                </Form>
            </Formik>
            )}
            </div>
        </div>
    )
};
