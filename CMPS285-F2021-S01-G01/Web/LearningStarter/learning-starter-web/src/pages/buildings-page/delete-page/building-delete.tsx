import "./building-delete.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Label, Segment } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { baseUrl } from "../../../constants/base-url";
import { routes } from "../../../routes/config";
import { ApiResponse, BuildingGetDto } from "../../../constants/types";

type DeleteBuildingResponse = ApiResponse<BuildingGetDto>;

export const BuildingDeletePage = () => {
    const history = useHistory();
    const [building, setBuilding] = useState<ApiResponse<BuildingGetDto>>();
    const buildingData = building?.data;
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
    }, [id]);

    const submitDeleteBuilding = () => {
        if (baseUrl === undefined) {
            return;
        }

        axios
            .delete<DeleteBuildingResponse>(`${baseUrl}/api/buildings/delete-building/${id}`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                    alert("Error");
                    return;
                }

                console.log("Successfully Deleted Building");
                history.push(routes.buildings);
            })
            .catch(({ response, ...rest }: AxiosError<DeleteBuildingResponse>) => {
                if (response?.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.log(err.message);
                    });
                    alert(response.data.errors[0].message);
                } else {
                    alert("Error Deleting Building");
                }
                console.log(rest.toJSON());
            });
    }

    return (
        <div>

            <div className="edit-page-title">
            <h1>Delete Building</h1>
            </div>

            <div className="padding-building">
                {buildingData && (
                    <Formik initialValues={id} onSubmit={submitDeleteBuilding}>
                        <Form>
                            <div className="field-delete-building-data">

                                <Segment raised color="red">
                                    <div>
                                        <div className="old-building-data">
                                            <div>
                                                <Label size="large">Building Name</Label>
                                            </div>
                                            <h3>{buildingData.buildingName}</h3>
                                        </div>

                                        <p>Are you sure you want to delete this building?</p>

                                        <div className="button-container-building">
                                            <Button negative fluid type="submit">Delete</Button>
                                            <Button fluid onClick={() => history.push('/buildings')}>Nevermind...</Button>
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