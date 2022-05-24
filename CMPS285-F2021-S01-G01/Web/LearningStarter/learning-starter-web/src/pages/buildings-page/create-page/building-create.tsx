import "./building-create.css";
import axios, { AxiosError } from "axios";
import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { ApiResponse, BuildingCreateDto } from "../../../constants/types";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { Field, Formik, Form } from "formik";
import { Button, Label, Modal } from "semantic-ui-react";

type CreateBuildingRequest = BuildingCreateDto;

type CreateBuildingResponse = ApiResponse<BuildingCreateDto>;

type FormValues = CreateBuildingRequest;

export const BuildingCreatePage = () => {
    const history = useHistory();
    
    const initialValues = useMemo<FormValues>(
        () => ({
            buildingName: ""
        }),
        []
    );

    const submitCreateBuilding = (values: CreateBuildingRequest) => {
        if (baseUrl === undefined) {
            return;
        }
        values.buildingName = String(values.buildingName);
        console.log("Values: ", values);

        axios
            .post<CreateBuildingResponse>(`${baseUrl}/api/buildings/create-building`, values)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`)
                    });
                    alert("Error");
                    return;
                }
                console.log("Successfully Created Building");
                history.push(routes.buildings);
            })
            .catch(({ response, ...rest }: AxiosError<CreateBuildingResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Creating Building");
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
        <div className="page-container-buildings">

            <div className="create-building-page-title">
            <h1>Create Building</h1>
            </div>

            <div>
                <div>
                    <Formik initialValues={initialValues} onSubmit={submitCreateBuilding}>
                        <Form>
                                <div>

                                    <div>
                                        <div className="display-building-info">
                                            <Label size="large">Building Name</Label>
                                        </div>
                                        <Field id="buildingName" name="buildingName" />
                                    </div>

                                    <div className="flex-box-centered-content-create-building">
                                    <div className="button-container">
                                        <Button fluid positive type="submit">
                                            Create
                                        </Button>
                                    </div>
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
                <Modal.Header> Discard building? </Modal.Header>
                <Modal.Content> Are you sure you would like to discard this building? </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => history.push("/buildings")}>
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