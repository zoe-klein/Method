import "./lecture-listing.css";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import { ApiResponse, LectureGetDto } from "../../constants/types";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../constants/base-url";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { routes } from "../../routes/config";
import moment from "moment";

type DeleteLectureResponse = ApiResponse<LectureGetDto>

export const LectureListing = () => {
  const [lecture, setLecture] = useState<ApiResponse<LectureGetDto>>();
  let { id } = useParams();

  useEffect(() => {
    axios
      .get<ApiResponse<LectureGetDto>>(`${baseUrl}/api/lectures/${id}`)
      .then((response) => {
        if (response.data.hasErrors) {
          response.data.errors.forEach((err) => {
            console.error(`${err.property}: ${err.message}`);
          });
        }
        setLecture(response.data);
      });
  }, [id]);

  const history = useHistory();

  const lectureToShow = lecture?.data;

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
    .delete<DeleteLectureResponse>(`${baseUrl}/api/lectures/${id}`)
    .then((response) => {
      if (response.data.hasErrors) {
        response.data.errors.forEach((err) => {
          console.error(`${err.property}: ${err.message}`);
        });
        alert("Error");
        return;
      }
      history.push(routes.getAllLectures);
    })
    .catch(({ response, ...rest }: AxiosError<DeleteLectureResponse>) => {
      if(response?.data.hasErrors) {
        response.data.errors.forEach((err) => {
          console.log(err.message);
        });
      } else {
        alert("Error Deleting Lecture");
      }  
      console.log(rest.toJSON());
    });
}

  return (
    <div className="page-container">
      {lectureToShow && (
        <div>
          <div className="header-format-lecture">
            <h2>
             {`${lectureToShow.lectureName} - Section ${lectureToShow.sectionNumber}`} 
             <h3> {`Class Time: ${moment(lectureToShow.classTime).format("MM/DD/YYYY")}`} </h3>
            </h2>
            <div>
              <div> <h4> {`Room Id: ${lectureToShow.roomId}`} </h4> </div>
              <div> <h4> {`Teacher Id: ${lectureToShow.teacherId}`} </h4> </div>
            </div>
            <div className="edit-button-helper">
              <Button primary onClick={() => history.push(`/lectures/lecture-edit/${id}`)}>
                Edit
              </Button>
              <Button color="red" onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}>
                Delete
              </Button>
            </div>
          </div>         
                <Modal
                  dimmer={dimmer}
                  open={open}
                  onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                >
                <Modal.Header> Delete This Lecture?</Modal.Header>
                <Modal.Content> Are you sure you would like to delete this lecture? </Modal.Content>
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
      )}
    </div>
  );
};