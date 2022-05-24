import "./room-create.css";
import axios, { AxiosError } from "axios";
import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { ApiResponse, RoomCreateDto } from "../../../constants/types";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { Field, Formik, Form } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";

type CreateRoomRequest = RoomCreateDto;

type CreateRoomResponse = ApiResponse<RoomCreateDto>;

type FormValues = CreateRoomRequest;

export const RoomCreatePage = () => {
    const history = useHistory();
    
    const initialValues = useMemo<FormValues>(
        () => ({
            roomNumber: 0,
            buildingId: 0
        }),
        []
    );

    const submitCreateRoom = (values: CreateRoomRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.roomNumber = Number(values.roomNumber);
        values.buildingId = Number(values.buildingId);
        console.log("Values: ", values);

        axios
            .post<CreateRoomResponse>(`${baseUrl}/api/rooms/create-room`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`)
                    });
                    alert("Error");
                    return;
                }
                console.log("Successfully Created Teacher");
                history.push(routes.rooms);
            })
            .catch(({ response, ...rest }: AxiosError<CreateRoomResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Creating Room");
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
            
            <div className="create-page-title-room">
            <h1>Create Room</h1>
            </div>

            <div className="flex-box-centered-content-create-room">
                <div>
                    <Formik initialValues={initialValues} onSubmit={submitCreateRoom}>
                        <Form>

                                <div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">Room Number</Label>
                                        </div>
                                        <Field id="roomNumber" name="roomNumber" />
                                    </div>
                                    <div>
                                        <div className="display-info">
                                            <Label size="large">Building ID</Label>
                                        </div>
                                        <Field id="buildingId" name="buildingId" />
                                    </div>

                                    <div className="display-info">
                                        <Button positive type="submit">
                                            Create
                                        </Button>
                                    </div>
                                </div>

                        </Form>
                    </Formik>

                    <div className="display-info">
                    <Button color='red' onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                        Cancel
                    </Button>
                    </div>
        
                    <Modal
                    dimmer={dimmer}
                    open={open}
                    onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                    >
                        <Modal.Header> Discard room? </Modal.Header>
                        <Modal.Content> Are you sure you would like to discard this room? </Modal.Content>
                        <Modal.Actions>
                            <Button negative onClick={() => history.push("/rooms")}>
                                Discard
                            </Button>
                            <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                                Nevermind...
                            </Button>
                        </Modal.Actions>
                        </Modal>

                </div>
            </div>
        </div>
    );
};