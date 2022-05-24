import "./room-listById.css";
import axios, { AxiosError} from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Divider, Modal } from "semantic-ui-react";
import { ApiResponse, RoomGetDto } from "../../../constants/types";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";

type DeleteRoomResponse = ApiResponse<RoomGetDto>

export const RoomListById = () => {
    const history = useHistory();
    const [room, setRoom] = useState<ApiResponse<RoomGetDto>>();

    let { id } = useParams();
    useEffect(() => {
        axios
         .get<ApiResponse<RoomGetDto>>(`${baseUrl}/api/rooms/get-room/${id}`)
         .then((response) => {
             if (response.data.hasErrors) {
                 response.data.errors.forEach((err) => {
                     console.error(`${err.property}: ${err.message}`);
                 });
             }
             setRoom(response.data);
         });
    }, [id]
    ); //end export

const roomToShow = room?.data;

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
     .delete<DeleteRoomResponse>(`${baseUrl}/api/rooms/${id}`)
     .then((response) => {
         if (response.data.hasErrors) {
             response.data.errors.forEach((err) => {
                 console.error(`${err.property}: ${err.message}`);
             });
             alert("Error");
             return;
         }
         console.log("Successfully Deleted the Room");
         //alert("Assignment Deleted!");
         history.push(routes.rooms);
     })
     .catch(({ response, ...rest }: AxiosError<DeleteRoomResponse>) => {
         if(response?.data.hasErrors) {
             response.data.errors.forEach((err) => {
                 console.log(err.message);
             });
         } else {
             alert("Error Deleting Room");
         }
         console.log(rest.toJSON());
     });
}

return (
    <div>
        <div>
            <div className="header-assignment">
            </div>
        {roomToShow && (
            <div>
                <Container text>
                    <div className="assignment-title"><h2> {`${roomToShow.roomNumber}`} </h2></div>
                    <div> {`Building Id: ${roomToShow.buildingId}`} </div>
                </Container>
                <Divider />
                    <p>
                    
                    </p>
            </div>
        )}

            <Button color='blue' onClick={() => history.push(`/rooms/edit-room/${id}`)}>
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
                <Modal.Header> Delete room? </Modal.Header>
                <Modal.Content> Are you sure you would like to delete this room? </Modal.Content>
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

            <Button color='yellow' onClick={() => history.push(`/rooms`)}>
                Go Back
            </Button>

        </div>
        
    </div>
    );
};