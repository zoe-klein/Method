import "./building-listing.css"
import React from "react";
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react";
import { ApiResponse, BuildingGetDto } from "../../../constants/types";
import axios from "axios";
import { baseUrl } from "../../../constants/base-url";
import { Button, Segment } from "semantic-ui-react";

export const BuildingListingPage = () => {
    const history = useHistory();
    const [buildings, setBuildings] = useState<ApiResponse<BuildingGetDto[]>>();

    useEffect(() => {
        axios
            .get<ApiResponse<BuildingGetDto[]>>(`${baseUrl}/api/buildings`)
            .then((response) => {
                if (response.data.hasErrors) {
                    response.data.errors.forEach((err) => {
                        console.error(`${err.property}: ${err.message}`);
                    });
                }
                setBuildings(response.data);
            });
    }, []);

    const buildingsToShow = buildings?.data;

    return (
        <div className="teacher-page-container">

            <div className="teacher-page-title">
            <h1>Buildings</h1>
            </div>

            <div className="teacher-boxes">
                {buildingsToShow && buildingsToShow.map((x: BuildingGetDto) => {
                    return (
                        <div className="teacher-box-separating">

                        <div>
                            <Segment horizontal raised color="grey">
                                <p>
                                <h3><div className="building-text-padding">{`${x.buildingName}`}</div></h3>
                                </p>

                                    <Button color="blue" onClick={() => history.push(`/buildings/edit-building/${x.id}`)}>
                                        Edit
                                    </Button>
                                    <Button color="red" onClick={() => history.push(`/buildings/delete-building/${x.id}`)}>
                                        Delete
                                    </Button>
                               
                            </Segment>
                        </div>

                        </div>
                    );
                })}

            <Segment horizontal raised circular>
            <div className = "teacher-newteach">
            <p>
              <h3>
                Add a new Building?
              </h3>
            </p>
          <Button color="green" type="submit" onClick={() => history.push(`/buildings/create`)}>
              +
            </Button>
            </div>
            </Segment>

            </div>
        </div>
    );
};