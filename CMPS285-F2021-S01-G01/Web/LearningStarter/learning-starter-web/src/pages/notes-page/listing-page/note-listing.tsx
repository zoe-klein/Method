import "./note-listing.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import { baseUrl } from "../../../constants/baseUrl";
import { ApiResponse, NoteGetDto } from "../../../constants/types";
import { useHistory } from "react-router-dom";
import moment from "moment";

//This is the bare minimum needed to make a page.
export const NoteListing = () => {
    const history = useHistory();
    const [notes, setNotes] = useState<ApiResponse<NoteGetDto[]>>();
    //let {id} = useParams();

    useEffect(() => {
        axios
          .get<ApiResponse<NoteGetDto[]>>(`${baseUrl}/api/notes`)
          .then((response) => {
            if (response.data.hasErrors) {
              response.data.errors.forEach((err) => {
                console.error(`${err.property}: ${err.message}`);
              });
            }
            setNotes(response.data);
          });
        //This empty array is important to ensure this only runs once on page load
        //Otherwise this will cause an infinite loop since we are setting State
      }, []);

    const notesToShow = notes?.data;
    return (
      <div className="page-container">
        <div className="notes-view-header">
          <h2> Notes </h2>
        </div>
        <div className = "note-flex-container"> 
            {notesToShow &&
            notesToShow.map((x: NoteGetDto) => {
            return (
              <div>
                <Segment horizontal raised color="grey">
                    <p>
                    <div>
                        <h3>
                        {`${x.title}`}
                        </h3>
                    </div>
                    <div className='note-DateCreated'>
                        <h5>
                        {`${moment(x.dateCreated).format("MM/DD/YYYY")}`}
                        </h5>
                    </div>
                    </p>
                    <div>
                      <Button color="vk" className="button-container-view-note" onClick={() => history.push(`/notes/${x.id}`)}>
                        View More
                      </Button>
                    </div>
                </Segment>
              </div>
            );
            })}
            <Segment horizontal raised circular>
              <div  className = "note-newNote">
              <p>
                <h3>
                  Add a new note?
                </h3>
              </p>
              <div>
                <Button color="green" className="button-container-view-note"onClick={() => history.push("/notes/create")}>
                  +
                </Button>
              </div>
              </div>
            </Segment>
        </div>
      </div>
    );
};
