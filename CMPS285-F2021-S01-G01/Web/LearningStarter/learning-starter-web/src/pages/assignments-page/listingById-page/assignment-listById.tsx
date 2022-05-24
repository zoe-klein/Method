import "./assignment-listById.css";
import axios, { AxiosError} from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Divider, Modal } from "semantic-ui-react";
import { ApiResponse, AssignmentGetDto } from "../../../constants/types";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import moment from "moment";

type DeleteAssignmentResponse = ApiResponse<AssignmentGetDto>

export const AssignmentListById = () => {
    const history = useHistory();
    const [assignment, setAssignment] = useState<ApiResponse<AssignmentGetDto>>();

    let { id } = useParams();
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

const assignmentToShow = assignment?.data;

//modal
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

//delete
const submitDelete = () => {
    if (baseUrl === undefined) {
        return;
    }

    axios
     .delete<DeleteAssignmentResponse>(`${baseUrl}/api/assignments/${id}`)
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
     .catch(({ response, ...rest }: AxiosError<DeleteAssignmentResponse>) => {
         if(response?.data.hasErrors) {
             response.data.errors.forEach((err) => {
                 console.log(err.message);
             });
         } else {
             alert("Error Deleting Assignment");
         }
         console.log(rest.toJSON());
     });
}

return (
    <div>
        <div>
            <div className="header-assignment">
            </div>
        {assignmentToShow && (
            <div>
                <Container text>
                    <div className="assignment-title"><h2> {`${assignmentToShow.name}`} </h2></div>
                    <div className="date-score">
                    <div> {`Due Date: ${moment(assignmentToShow.dueDate).format("MM/DD/YYYY")}`} </div>
                    <div> {`Score: ${assignmentToShow.score}`} </div>
                    </div>
                    <div> {`${assignmentToShow.description}`} </div>
                </Container>
                <Divider />
                    <p>
                    
                    </p>
            </div>
        )}

            <Button color='blue' onClick={() => history.push(`/assignments/assignments-edit/${id}`)}>
                Edit
            </Button>

            <Button color='red' onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                Delete
            </Button>
            <Modal
                dimmer={dimmer}
                open={open}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
            >
                <Modal.Header> Delete an assignment? </Modal.Header>
                <Modal.Content> Are you sure you would like to delete this assignment? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => submitDelete()}>
                        Delete
                    </Button>
                    <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                        Nevermind...
                    </Button>
                </Modal.Actions>
            </Modal>

            <div className="button-spacing"> </div>

            <Button color='yellow' onClick={() => history.goBack(routes.lectureListing)}>
                Go Back
            </Button>

        </div>
        
    </div>
    );
};

