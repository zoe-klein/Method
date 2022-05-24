import "./building-listById.css";
import axios, { AxiosError} from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Divider, Modal } from "semantic-ui-react";
import { ApiResponse, BuildingGetDto } from "../../../constants/types";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";

type DeleteBuildingResponse = ApiResponse<BuildingGetDto>

export const BuildingListById = () => {
    const history = useHistory();
    const [building, setBuilding] = useState<ApiResponse<BuildingGetDto>>();

    let { id } = useParams();
    useEffect(() => {
        axios
         .get<ApiResponse<BuildingGetDto>>(`${baseUrl}/api/buildings/get-building/${id}`)
         .then((response) => {
             if (response.data.hasErrors) {
                 response.data.errors.forEach((err) => {
                     console.error(`${err.property}: ${err.message}`);
                 });
             }
             setBuilding(response.data);
         });
    }, [id]
    ); //end export

const buildingToShow = building?.data;

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
     .delete<DeleteBuildingResponse>(`${baseUrl}/api/buildings/get-building/${id}`)
     .then((response) => {
         if (response.data.hasErrors) {
             response.data.errors.forEach((err) => {
                 console.error(`${err.property}: ${err.message}`);
             });
             alert("Error");
             return;
         }
         console.log("Successfully Deleted the Building");
         //alert("Assignment Deleted!");
         history.push(routes.buildings);
     })
     .catch(({ response, ...rest }: AxiosError<DeleteBuildingResponse>) => {
         if(response?.data.hasErrors) {
             response.data.errors.forEach((err) => {
                 console.log(err.message);
             });
         } else {
             alert("Error Deleting Building");
         }
         console.log(rest.toJSON());
     });
}

return (
    <div>
        <div>
            <div className="header-assignment">
            </div>
        {buildingToShow && (
            <div>
                <Container text>
                    <div className="assignment-title"><h2> {`${buildingToShow.buildingName}`} </h2></div>
                </Container>
                <Divider />
                    <p>
                    
                    </p>
                    
            </div>
        )}

            <Button color='blue' onClick={() => history.push(`/buildings/edit-building/${id}`)}>
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
                <Modal.Header> Delete building? </Modal.Header>
                <Modal.Content> Are you sure you would like to delete this building? </Modal.Content>
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

            <Button color='yellow' onClick={() => history.push(`/buildings`)}>
                Go Back
            </Button>

        </div>
        
    </div>
    );
};