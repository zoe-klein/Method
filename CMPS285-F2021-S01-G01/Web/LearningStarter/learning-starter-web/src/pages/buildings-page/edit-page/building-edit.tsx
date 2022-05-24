import "./building-edit.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label, Modal } from "semantic-ui-react";
import { Formik, Form, Field } from "formik";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { ApiResponse, BuildingGetDto, BuildingEditDto } from "../../../constants/types";

type EditBuildingRequest = BuildingEditDto;

type EditBuildingResponse = ApiResponse<BuildingEditDto>;

type FormValues = EditBuildingRequest;

export const BuildingEditPage = () => {
    const history = useHistory();
    const [building, setBuilding] = useState<ApiResponse<BuildingGetDto>>();
    let { id } = useParams();

    const buildingData = building?.data;

    const initialValues = useMemo<FormValues>(
        () => ({
            id: id,
            buildingName: ""
        }),
        [id]
    );

    if (buildingData !== undefined) {
        initialValues.id = buildingData.id;
        initialValues.buildingName = buildingData.buildingName;
    }

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
    }, [id]);

    const submitEditBuilding = (values: EditBuildingRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.buildingName = String(values.buildingName);
        console.log("Values: ", values);

        axios
            .put<EditBuildingResponse>(`${baseUrl}/api/buildings/edit-building/${id}`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Edited Building");
                history.push(routes.buildings);
            })
            .catch(({ response, ...rest }: AxiosError<EditBuildingResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Editing Building");
                }
                console.log(rest.toJSON());
            });
    }

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
        <div>

            <div className="edit-page-title">
            <h1>Edit Building Name</h1>
            </div>

            <div>

                <div className="page-container-assignments">
                    {buildingData && (
                        <Formik initialValues={initialValues} onSubmit={submitEditBuilding}>
                            <Form>
                                <div>
                                    
                                        <div>
                                            <div>
                                                <div>

                                                    <div className="display-edit-info">
                                                        <Label size="large">New Building Name</Label>
                                                    </div>

                                                    <Field id="buildingName" name="buildingName" />
                                                </div>
                                            </div>

                                            <div className="button-for-edit">
                                                <Button positive type="submit">Submit</Button>
                                            </div>
                                        </div>

                                </div>
                            </Form>
                        </Formik>
                    )}

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
                        <Button negative onClick={() => history.push(`/buildings/`)}>
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
    )
}