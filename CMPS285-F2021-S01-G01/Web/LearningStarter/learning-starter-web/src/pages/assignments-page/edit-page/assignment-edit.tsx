import "./assignment-edit.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ApiResponse, AssignmentEditDto, AssignmentGetDto } from "../../../constants/types";
import { baseUrl } from "../../../constants/base-url";

type EditAssignmentRequest = Omit<AssignmentEditDto, "user" | "id">;

type EditAssignmentResponse = ApiResponse<AssignmentEditDto>;

type FormValues = EditAssignmentRequest;

//show the assignment
export const AssignmentEditById = () => {
    const history = useHistory();
    const [assignment, setAssignment] = useState<ApiResponse<AssignmentGetDto>>();
    let { id } = useParams();

    const assignmentData = assignment?.data

    useEffect(() => {
        axios
         .get<ApiResponse<AssignmentGetDto>>(`${baseUrl}/api/assignments/${id}`)
         .then((response) => {
             if (response.data.hasErrors) {
                 response.data.errors.forEach((err) => {
                     console.error(`${err.property}: ${err.message}`);
                 });
             }
             setAssignment(response.data);
         });
    }, [id]
    ); //end export

    const initialValues = useMemo<FormValues>(
        () => ({
          name: "",
          dueDate: new Date(),
          score: 0,
          description: "",
        }),
        []
      );

      if (assignmentData !== undefined) {
          initialValues.name = assignmentData.name;
          initialValues.dueDate = assignmentData.dueDate;
          initialValues.score = assignmentData.score;
          initialValues.description = assignmentData.description;
      }

    const submitEdit = (values: EditAssignmentRequest) => {
        if (baseUrl === undefined) {
          return;
        }
        values.name = String(values.name);
        values.dueDate = new Date(values.dueDate);
        values.score = Number(values.score);
        values.description = String(values.description);
        console.log("Values: ", values);
    
        axios
          .put<EditAssignmentResponse>(`${baseUrl}/api/assignments/assignments-edit/${id}`, values)
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
          .catch(({ response, ...rest }: AxiosError<EditAssignmentResponse>) => {
            if (response?.data.hasErrors) {
              response?.data.errors.forEach((err) => {
                console.log(err.message);
              });
              alert(response?.data.errors[0].message);
            } else {
              alert(`There was an error editing the assignment`);
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

    //shows the assignments
    return (
      <div>

          <div className="edit-page-title">
            <h1>Edit Assignment</h1>
          </div>

      <div className="page-container-assignments">
        <Formik initialValues={initialValues} onSubmit={submitEdit}>
          <Form>
            <div>

              {/* name */}
              <div>
                <div className="display-edit-info">
                  <Label size="large">Name</Label>
                </div>
                  <Field id="name" name="name" />
              </div>

              {/* due date */}
              <div>
                <div className="display-edit-info">
                  <Label size="large">Due Date</Label>
                </div>
                  <Field id="dueDate" name="dueDate" type = "date" />
              </div>

              {/* score */}
              <div>
                <div className="display-edit-info">
                  <Label size="large">Score</Label>
                </div>
                  <Field id="score" name="score" />
              </div>

              {/* description */}
              <div>
                <div className="display-edit-info">
                  <Label size="large">Description</Label>
                </div>
                  <Field as = "textarea" id="description" name="description" rows="10" cols="65"/>
              </div>

                {/* buttons */}
              <div className="button-for-edit">
                <Button color='green' className="create-button" type="submit">
                  Save Changes
                </Button>
                
            </div>
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
                    <Button negative onClick={() => history.push(`/assignments/${id}`)}>
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
