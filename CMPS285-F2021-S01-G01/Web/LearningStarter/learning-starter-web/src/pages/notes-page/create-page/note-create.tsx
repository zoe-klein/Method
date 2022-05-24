import "./note-create.css";
import axios, { AxiosError } from "axios";
import { Field, Formik, Form } from "formik";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label} from "semantic-ui-react";
import { baseUrl } from "../../../constants/baseUrl";
import { ApiResponse, NoteCreateDto } from "../../../constants/types";
type CreateNoteRequest = NoteCreateDto;

type CreateNoteResponse = ApiResponse<NoteCreateDto>;

type FormValues = CreateNoteRequest;

export const NoteCreatePage = () => {
    const history = useHistory();
    let {id} = useParams();

    const initialValues = useMemo<FormValues>(
      () => ({
        title: "",
        dateCreated: new Date(),
        content: "",
        userLectureId: 1,
      }),
      []
    );

    const submitCreate = (values: CreateNoteRequest) => {
        if (baseUrl === undefined) {
          return;
        }
        values.title = String(values.title);
        values.dateCreated = new Date(values.dateCreated);
        values.content = String(values.content);
        values.userLectureId = Number(values.userLectureId);
        console.log("", values);

        axios
        .post<CreateNoteResponse>(`${baseUrl}/api/notes/note-create`, values)
        .then((response) => {
        //there should be no errors here, but just in case there are errors for some unknown reason
            if (response.data.hasErrors) {
                response.data.errors.forEach((err) => {
                    console.error(`${err.property}: ${err.message}`);
                });
                alert("There was an Error");
                return;
            }
            history.goBack();
        })
        .catch(({ response, ...rest }: AxiosError<CreateNoteResponse>) => {
            if (response?.data.hasErrors) {
                response?.data.errors.forEach((err) => {
                console.log(err.message);
             });
            alert(response?.data.errors[0].message);
            } else {
                alert(`There was an error creating the note`);
            }
            console.log(rest.toJSON());
        });
    }   

    return (
        <div>
            <div className="create-note-form">
            <Formik initialValues={initialValues} onSubmit={submitCreate}>
                <Form>
                <div>
                    <div className="flex-box-centered-content-create-note">
                        <div>
                            <div className="field-label">
                                <Label id="title"> Title </Label>
                            </div>
                            <Field className="field" id="title" name="title" placeholder="type here..." />
                        </div>
                        <div>
                            <div className="field-label">
                                <Label id="dateCreated"> Date Created </Label>
                            </div>
                            <Field type="date" id="dateCreated" name="dateCreated" placeholder="type here" />
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
                <div className="button-container-create-note">
                    <Button color='green' className="create-button" type="submit">
                        Submit
                    </Button>
                    <Button className="button-container-create-note" onClick={() => history.goBack(`lectures/${id}`)}>
                        Discard
                    </Button>
                </div>
                </Form>
            </Formik>

            </div>
        </div>
    );
}

