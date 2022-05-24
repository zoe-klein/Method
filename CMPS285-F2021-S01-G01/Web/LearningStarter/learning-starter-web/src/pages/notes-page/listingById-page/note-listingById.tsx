import "./note-listingById.css";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../constants/baseUrl";
import { ApiResponse, NoteGetDto } from "../../../constants/types";
import { useParams } from "react-router-dom";
import { Button, Header, Container, Divider, Modal} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { routes } from "../../../routes/config";
//import { Field, Formik, Form } from "formik";

type DeleteNoteResponse = ApiResponse<NoteGetDto>

export const NoteListById = () => {
  const history = useHistory();
  const [note, setNote] = useState<ApiResponse<NoteGetDto>>();

  let { id } = useParams();
  useEffect(() => {
      axios
        .get<ApiResponse<NoteGetDto>>(`${baseUrl}/api/notes/${id}`)
        .then((response) => {
          if (response.data.hasErrors) {
            response.data.errors.forEach((err) => {
              console.error(`${err.property}: ${err.message}`);
            });
          }
          setNote(response.data);
        });
    }, [id]
  );

  const noteToShow = note?.data;

  //modal stuff
  function exampleReducer(state, action) {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { open: true, dimmer: action.dimmer }
      case 'CLOSE_MODAL':
        return { open: false }
      default:
        throw new Error()
    }
  }
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    dimmer: undefined,
  })
  const { open, dimmer } = state

  //delete stuff
  const submitDelete = () => {
    if (baseUrl === undefined) {
      return;
    }

    axios
      .delete<DeleteNoteResponse>(`${baseUrl}/api/notes/${id}`)
      .then((response) => {
        if (response.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.error(`${err.property}: ${err.message}`);
          });
          alert("Error");
          return;
        }
        history.goBack(routes.lectureListing);
      })
      .catch(({ response, ...rest }: AxiosError<DeleteNoteResponse>) => {
        if(response?.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.log(err.message);
          });
        } else {
          alert("Error Deleting Note");
        }  
        console.log(rest.toJSON());
      });
  }
  

  return (
    <div>
      <div className="note-view-button">
        <Button color='yellow' onClick={() => history.goBack()}>
          Go Back
        </Button>
        <Button primary onClick={() => history.push(`/notes/edit/${id}`)}>
          Edit
        </Button>

        <Button color="red" onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
          Delete
        </Button>
        <Modal
          dimmer={dimmer}
          open={open}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        >
          <Modal.Header> Delete A Note?</Modal.Header>
          <Modal.Content> Are you sure you would like to delete this note? </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => submitDelete()}>
              Delete
            </Button>
            <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
              Nevermind...
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
      {noteToShow && (
        <div>
          <Container text> 
            <Header> {`${noteToShow.title}`} </Header>
            <h4> {`${moment(noteToShow.dateCreated).format("MM/DD/YYYY")}`} </h4>
          </Container>
          <Divider />
            <p className="view-note-content">
              {`${noteToShow.content}`}
            </p>
        </div>
      )}
    </div>
  );
};

