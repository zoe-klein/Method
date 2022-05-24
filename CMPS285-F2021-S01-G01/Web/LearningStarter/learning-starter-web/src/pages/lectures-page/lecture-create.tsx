import "./lecture-create.css";
import axios, { AxiosError } from "axios";
import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { baseUrl } from "../../constants/base-url";
import { LectureCreateDto, ApiResponse } from "../../constants/types";
import { routes } from "../../routes/config";

type CreateLectureRequest = LectureCreateDto;

type CreateLectureResponse = ApiResponse<LectureCreateDto>;

type FormValues = CreateLectureRequest;

export const LectureCreatePage = () => {
  const history = useHistory();
  const initialValues = useMemo<FormValues>(
    () => ({
      lectureName: "",
      sectionNumber: 0,
      classTime: new Date(),
      roomId: 0,
      teacherId: 0,
    }),
    []
  );

  const submitCreate = (values: CreateLectureRequest) => {
    if (baseUrl === undefined) {
      return;
    }
    values.lectureName = String(values.lectureName);
    values.sectionNumber = Number(values.sectionNumber);
    values.roomId = Number(values.roomId);
    values.teacherId = Number(values.teacherId);

    axios
      .post<CreateLectureResponse>(
        `${baseUrl}/api/lectures/create-lecture`,
        values
      )
      .then((response) => {
        if (response.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.error(`${err.property}: ${err.message}`);
          });
          alert("There was an Error");
          return;
        }
        history.push(routes.getAllLectures);
      })
      .catch(({ response, ...rest }: AxiosError<CreateLectureResponse>) => {
        if (response?.data.hasErrors) {
          response?.data.errors.forEach((err) => {
            console.log(err.message);
          });
          alert(response?.data.errors[0].message);
        } else {
          alert(`There was an error creating the class`);
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
    <div className="flex-box-center-aligned-content-lecture-listing">
      <div>
        <Formik initialValues={initialValues} onSubmit={submitCreate}>
          <Form>
            <div>
              <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                  <Label size="large"> Lecture Name </Label>
                </div>
                <Field className="field" id="lectureName" name="lectureName" />
              </div>
              <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                  <Label size="large"> Section Number </Label>
                </div>
                <Field
                  className="field"
                  type="number"
                  id="sectionNumber"
                  name="sectionNumber"
                />
              </div>
              <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                  <Label size="large"> Class Time </Label>
                </div>
                <Field
                  type="date"
                  className="field"
                  id="classTime"
                  name="classTime"
                />
              </div>
              <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                  <Label size="large"> Room Id </Label>
                </div>
                <Field className="field" type="number" id="roomId" name="roomId" />
              </div>
              <div className="flex-box-center-aligned-content-lecture-listing">
                <div>
                  <Label size="large"> Teacher Id</Label>
                </div>
                <Field className="field" type="number" id="teacherId" name="teacherId" />
              </div>
              <div className="button-container-create-lecture">
                <Button positive className="create-button" type="submit">
                  Create
                </Button>
              </div>
            </div>
          </Form>
        </Formik>
        <Button color='red' className= "button-for-create" onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                Cancel
            </Button>
            <Modal
                dimmer={dimmer}
                open={open}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
            >
                <Modal.Header> Discard an assignemnt? </Modal.Header>
                <Modal.Content> Are you sure you would like to discard this assignment? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => history.push("/lectures")}>
                        Yes
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
