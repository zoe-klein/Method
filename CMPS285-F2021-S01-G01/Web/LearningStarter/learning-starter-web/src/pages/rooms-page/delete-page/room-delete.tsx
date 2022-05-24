import "./room-delete.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label, Segment } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { ApiResponse, RoomGetDto } from "../../../constants/types";

type DeleteRoomResponse = ApiResponse<RoomGetDto>;

export const RoomDeletePage = () => {
    const history = useHistory();
    const [room, setRoom] = useState<ApiResponse<RoomGetDto>>();
    const roomData = room?.data;
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
    }, [id]);

    const submitDeleteRoom = () => {
        if (baseUrl === undefined) {
            return;
        }

        axios
            .delete<DeleteRoomResponse>(`${baseUrl}/api/rooms/delete-room/${id}`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Deleted Room");
                history.push(routes.rooms);
            })
            .catch(({ response, ...rest }: AxiosError<DeleteRoomResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Deleting Room");
                }
                console.log(rest.toJSON());
            });
    }

    return (
        <div>

            <div className="edit-page-title">
            <h1>Delete Room</h1>
            </div>

            <div className="padding-building">
                {roomData && (
                    <Formik initialValues={id} onSubmit={submitDeleteRoom}>
                        <Form>

                            <div className="field-delete-room-data">

                                <Segment raised color="red">
                                    <div>

                                        <div>
                                            <div>
                                                <Label size="large">Room Number</Label>
                                            </div>
                                            {roomData.roomNumber}
                                            <div>
                                                <Label size="large">Building ID</Label>
                                            </div>
                                            {roomData.buildingId}
                                        </div>

                                        <p>Are you sure you want to delete this room?</p>

                                        <div>
                                            <Button negative type="submit">Delete</Button>
                                            <Button onClick={() => history.push('/rooms')}>Nevermind...</Button>
                                        </div>
                                    </div>
                                </Segment>

                            </div>
                        </Form>
                    </Formik>
                )}
            </div>
        </div>
    )
}