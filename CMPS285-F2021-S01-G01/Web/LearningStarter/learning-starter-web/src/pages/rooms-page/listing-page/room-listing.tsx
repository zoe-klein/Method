import "./room-listing.css"
import React from "react";
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react";
import { ApiResponse, RoomGetDto } from "../../../constants/types";
import axios from "axios";
import { baseUrl } from "../../../constants/base-url";
import { Button, Segment } from "semantic-ui-react";

export const RoomListingPage = () => {
    const history = useHistory();
    const [rooms, setRooms] = useState<ApiResponse<RoomGetDto[]>>();

    useEffect(() => {
        axios
            .get<ApiResponse<RoomGetDto[]>>(`${baseUrl}/api/rooms`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                }
                setRooms(response.data);
            });
    }, []);

    const roomsToShow = rooms?.data;

    return (
        <div className="page-container-rooms">
            
            <div className="room-page-title">
            <h1>Room Numbers</h1>
            </div>

            <div className="room-boxes">
                {roomsToShow && roomsToShow.map((x: RoomGetDto) => {

                    return (
                        <div className="box-separating-rooms">

                            <Segment horizontal raised color="grey">
                                <h3><div>{`${x.roomNumber}`}</div></h3>
                                    <div>{`Building: ${x.buildingId}`}</div>

                                <div>

                                <Button color='blue' onClick={() => history.push(`/rooms/edit-room/${x.id}`)}>
                                    Edit
                                </Button>
                                <Button color='red' onClick={() => history.push(`/rooms/delete-room/${x.id}`)}>
                                    Delete
                                </Button>
                                    
                                </div>
                            </Segment>

                        </div>
                    );
                })}

            <Segment horizontal raised circular>
            <div className = "assignment-newAssign">
            <p>
              <h3>
                Add a new Room?
              </h3>
            </p>
          <Button color="green" type="submit" onClick={() => history.push(`/rooms/create`)}>
              +
            </Button>
            </div>
            </Segment>

            </div>
        </div>
    );
};