import "./room-edit.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label } from "semantic-ui-react";
import { Formik, Form, Field } from "formik";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { ApiResponse, RoomGetDto, RoomEditDto } from "../../../constants/types";

type EditRoomRequest = RoomEditDto;

type EditRoomResponse = ApiResponse<RoomEditDto>;

type FormValues = EditRoomRequest;

export const RoomEditPage = () => {
    const history = useHistory();
    const [room, setRoom] = useState<ApiResponse<RoomGetDto>>();
    let { id } = useParams();

    const roomData = room?.data;

    const initialValues = useMemo<FormValues>(
        () => ({
            id: id,
            roomNumber: 0,
            buildingId: 0,
        }),
        [id]
    );

    if (roomData !== undefined) {
        initialValues.roomNumber = roomData.roomNumber;
        initialValues.buildingId = roomData.buildingId;
    }

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

    const suubmitEditRoom = (values: EditRoomRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.roomNumber = Number(values.roomNumber);
        values.buildingId = Number(values.buildingId);
        console.log("Values: ", values);

        axios
            .put<EditRoomResponse>(`${baseUrl}/api/rooms/edit-room/${id}`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Edited Room");
                history.push(routes.rooms);
            })
            .catch(({ response, ...rest }: AxiosError<EditRoomResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Editing Room");
                }
                console.log(rest.toJSON());
            });
    }

    return (
        <div className="page-container">

            <div className="create-page-title-room">
            <h1>Room Edit Page</h1>
            </div>

            <div className="flex-box-centered-content-create-room">
                <div>
                    {roomData && (
                        <Formik initialValues={initialValues} onSubmit={suubmitEditRoom}>
                            <Form>
                                <div>
                                    
                                        <div>
                                            <div>

                                                <div>
                                                    <div className="display-info">
                                                        <Label size="large">New Room Number</Label>
                                                    </div>
                                                    <Field id="roomNumber" name="roomNumber" />
                                                </div>

                                                <div>
                                                    <div className="display-info">
                                                        <Label size="large" id="buildingId" name="buildingId">New Building ID</Label>
                                                    </div>
                                                    <Field id="buildingId" name="buildingId" />
                                                </div>

                                            </div>

                                            <div className="display-info">
                                                <Button positive type="submit">Submit</Button>
                                                <Button negative onClick={() => history.push("/rooms")}>Discard</Button>
                                            </div>
                                        </div>
                                    
                                </div>
                            </Form>
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    )
}