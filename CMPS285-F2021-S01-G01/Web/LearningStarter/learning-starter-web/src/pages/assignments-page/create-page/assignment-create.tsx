import "./assignment-create.css";
import axios, { AxiosError } from "axios";
import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { ApiResponse, AssignmentCreateDto } from "../../../constants/types";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type CreateAssignmentRequest = Omit<AssignmentCreateDto, "user" | "id">;

type CreateAssignmentResponse = ApiResponse<AssignmentCreateDto>;

type FormValues = CreateAssignmentRequest;

export const AssignmentCreatePage = () => {
  const history = useHistory();

  const initialValues = useMemo<FormValues>(
    () => ({
      name: "",
      dueDate: new Date(),
      score: 0,
      description: "",
    }),
    []
  );

  const submitCreate = (values: CreateAssignmentRequest) => {
    if (baseUrl === undefined) {
      return;
    }
    values.name = String(values.name);
    values.dueDate = new Date(values.dueDate);
    values.score = Number(values.score);
    values.description = String(values.description);
    console.log("Values: ", values);

    axios
      .post<CreateAssignmentResponse>(`${baseUrl}/api/assignments/assignments-create`, values)
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
      .catch(({ response, ...rest }: AxiosError<CreateAssignmentResponse>) => {
        if (response?.data.hasErrors) {
          response?.data.errors.forEach((err) => {
            console.log(err.message);
          });
          alert(response?.data.errors[0].message);
        } else {
          alert(`There was an error creating the assignment`);
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
        <h1>Create Assignment</h1>
      </div>
      <div>
        <Formik initialValues={initialValues} onSubmit={submitCreate}>
          <Form>
            <div>

              <div>
                  {/* name */}
                <div className="display-info">
                  <Label size="large">Name</Label>
                </div>
                <Field id="name" name="name" />
              </div>

              <div>
                  {/* due date */}
                <div className="display-info">
                  <Label size="large">Due Date</Label>
                </div>
                <Field id="dueDate" name="dueDate" type = "date" />
              </div>

              <div>
                  {/* score */}
                <div className="display-info">
                  <Label size="large">Score</Label>
                </div>
                <Field id="score" name="score" />
              </div>

              <div>
                  {/* description */}
                <div className="display-info">
                    <Label size="large">Description</Label>
                </div>
                <Field as = "textarea" id="description" name="description" rows="10" cols="65"/>  
              </div>

                {/* buttons */}
              <div className="button-for-create">
                <Button color='green' type="submit">
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
                <Modal.Header> Discard an assignment? </Modal.Header>
                <Modal.Content> Are you sure you would like to discard this assignment? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => history.goBack()}>
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
