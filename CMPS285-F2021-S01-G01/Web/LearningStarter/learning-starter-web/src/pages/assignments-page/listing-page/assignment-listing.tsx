import "./assignment-listing.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Segment } from "semantic-ui-react";
import { ApiResponse, AssignmentGetDto } from "../../../constants/types";
import { baseUrl } from "../../../constants/base-url";
import moment from "moment";

export const AssignmentListing = () => {
    const [assignments, setAssignments] = useState<ApiResponse<AssignmentGetDto[]>>();
    const history = useHistory();
  
    useEffect(() => {
      axios
        .get<ApiResponse<AssignmentGetDto[]>>(`${baseUrl}/api/assignments`)
        .then((response) => {
          if (response.data.hasErrors) {
            response.data.errors.forEach((err) => {
              console.error(`${err.property}: ${err.message}`);
            });
          }
          setAssignments(response.data);
        });
      //This empty array is important to ensure this only runs once on page load
      //Otherwise this will cause an infinite loop since we are setting State
    }, []);

    const assignmentsToShow = assignments?.data;
    return (
      <div className="page-container-assignments">

        <div className="page-title">
          <h2> Assignments </h2>
        </div>
        
        <div className="assignment-boxes">
        {assignmentsToShow &&
          assignmentsToShow.map((x: AssignmentGetDto) => {
            return (
              <div className="box-separating">
              <div>
                <Segment horizontal raised color="grey">
                  <p>
                <div className="assignment-text-padding"> <h3> {`${x.name}`} </h3></div>
                <div className="assignment-text-padding"> <h5> {`Due Date: ${moment(x.dueDate).format("MM/DD/YYYY")}`} </h5></div>
                <div><h5> {`Score: ${x.score}`} </h5></div>
                  </p>
                  
                {/* buttons */}
              <div>
                <Button color="vk" type="submit" onClick={() => history.push(`/assignments/${x.id}`)}>
                  View More
                </Button>
              </div>

                </Segment>
              </div>
              </div>

            );

          })}

          <Segment horizontal raised circular>
            <div className = "assignment-newAssign">
            <p>
              <h3>
                Add a new Assignment?
              </h3>
            </p>
          <Button color="green" type="submit" onClick={() => history.push(`/assignments/assignments-create`)}>
              +
            </Button>
            </div>
            </Segment>
          </div>
      </div>
    );
};

