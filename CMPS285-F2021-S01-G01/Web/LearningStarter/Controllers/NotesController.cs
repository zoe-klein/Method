using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/notes")]
    public class NotesController : Controller
    {
        private readonly DataContext _dataContext;
        public NotesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllNotes()
        {
            var response = new Response();

            var notesToReturn = _dataContext
                .Notes
                .Select(item => new NoteGetDto
                {
                    Id = item.Id,
                    Title = item.Title,
                    DateCreated = item.DateCreated,
                    Content = item.Content,
                    UserLectureId = item.UserLectureId
                })
                .ToList();

            if (notesToReturn.Capacity == 0)
            {
                response.AddError("", "There are no existing notes to return.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            response.Data = notesToReturn;
            return Ok(response);
        }

        [HttpGet("{noteId:int}")]
        public IActionResult GetNoteById([FromRoute] int noteId)
        {
            var response = new Response();

            var noteFromDatabase = _dataContext.Notes.FirstOrDefault(x => x.Id == noteId);

            if (noteFromDatabase == null)
            {
                response.AddError("noteId", $"No Notes found in database with the id of {noteId}.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var noteToReturn = new NoteGetDto
            {
                Id = noteFromDatabase.Id,
                Title = noteFromDatabase.Title,
                DateCreated = noteFromDatabase.DateCreated,
                Content = noteFromDatabase.Content,
                UserLectureId = noteFromDatabase.UserLectureId
            };

            response.Data = noteToReturn;

            return Ok(response);
        }

        [HttpPost("note-create")]
        public IActionResult CreateNote(NoteCreateDto noteCreateDto)
        {
            var response = new Response();
            
            if (noteCreateDto == null)
            {
                response.AddError("", "Critical error. Please contact admin.");
                return BadRequest(response);
            } 

            if (string.IsNullOrEmpty(noteCreateDto.Title?.Trim()))
             {
                response.AddError("Title", "Title should not be empty.");
             }
            if (noteCreateDto.Title != null && noteCreateDto.Title.Trim().Length > 32)
             {
              response.AddError("Title", "Title is too long. Must be less than 32 characters.");
             }

            //fk errors
            if (string.IsNullOrEmpty(noteCreateDto.UserLectureId.ToString()))
            {
                response.AddError("UserlectureId", "Cannot be empty");
            }

            foreach (var userLectureId in noteCreateDto.UserLectureId.ToString())
            {
                var userLecture = _dataContext.UserLectures.FirstOrDefault(x => x.Id == noteCreateDto.UserLectureId);

                if (userLecture == null)
                {
                    response.AddError("UserLectureId", $"UserLecture with Id {noteCreateDto.UserLectureId} does not exist");
                }
            }

            //return errors if errors
            if (response.HasErrors)
            {
                return BadRequest(response);
            };

            //if no errors do the stuff
            var noteToCreate = new Note
            {
                Title = noteCreateDto.Title,
                DateCreated = noteCreateDto.DateCreated,
                Content = noteCreateDto.Content,
                UserLectureId = noteCreateDto.UserLectureId
            };

            _dataContext.Notes.Add(noteToCreate);
            _dataContext.SaveChanges();

            var noteToReturn = new NoteGetDto
            {
                Id = noteToCreate.Id,
                Title = noteToCreate.Title,
                DateCreated = noteToCreate.DateCreated,
                Content = noteToCreate.Content,
                UserLectureId = noteToCreate.UserLectureId
            };

            response.Data = noteToReturn;

            return Ok(response);
        }

        [HttpPut("edit/{noteId:int}")]
        public IActionResult EditNote([FromRoute] int noteId, [FromBody] NoteEditDto noteEditDto)
        {
            var response = new Response();
            //errors for improper id
            var noteToEdit = _dataContext.Notes.FirstOrDefault(x => x.Id == noteId);
            if (noteToEdit == null)
            {
                response.AddError("noteId", $"No notes found in the database with the Id of {noteId}");
            }
            //errors for improper title
            if (noteEditDto == null)
            {
                response.AddError("", "Critical error. Please contact admin.");
                return BadRequest(response);
            }

            if (string.IsNullOrEmpty(noteEditDto.Title?.Trim()))
            {
                response.AddError("Title", "Title should not be empty.");
            }
            if (noteEditDto.Title != null && noteEditDto.Title.Trim().Length > 32)
            {
                response.AddError("Title", "Title is too long. Must be less than 32 characters.");
            }

            //fk errors
            if (string.IsNullOrEmpty(noteEditDto.UserLectureId.ToString()))
            {
                response.AddError("UserlectureId", "Cannot be empty");
            }

            foreach (var buildingId in noteEditDto.UserLectureId.ToString())
            {
                var building = _dataContext.Buildings.FirstOrDefault(x => x.Id == noteEditDto.UserLectureId);

                if (building == null)
                {
                    response.AddError("BuildingId", $"Building with Id {noteEditDto.UserLectureId} does not exist");
                }
            }

            //return errors if errors
            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            //do the stuff if no errors
            noteToEdit.Title = noteEditDto.Title;
            noteToEdit.Content = noteEditDto.Content;
            noteToEdit.UserLectureId = noteToEdit.UserLectureId;

            _dataContext.SaveChanges();

            var noteToReturn = new NoteGetDto
            {
                Id = noteToEdit.Id,
                Title = noteToEdit.Title,
                Content = noteToEdit.Content,
                UserLectureId = noteToEdit.UserLectureId
            };

            return Ok(response);
        }

        [HttpDelete("{noteId:int}")]
        public IActionResult DeleteNote([FromRoute] int noteId)
        {
            var response = new Response();

            var noteToDelete = _dataContext.Notes.FirstOrDefault(x => x.Id == noteId);

            if (noteToDelete == null)
            {
                response.AddError("noteId", $"No notes found in the database with the Id of {noteId}");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            _dataContext.Notes.Remove(noteToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }

    }
}
