using LearningStarter.Entities;
using LearningStarter.Common;
using LearningStarter.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("/api/lectures")]
    public class LecturesController : Controller
    {
        private readonly DataContext _dataContext;

        public LecturesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllLectures()
        {
            var response = new Response();

            var lecturesToReturn = _dataContext
                .Lectures
                .Select(x => new LectureGetDto
                {
                    Id = x.Id,
                    LectureName = x.LectureName,
                    SectionNumber = x.SectionNumber,
                    ClassTime = x.ClassTime,
                    RoomId = x.RoomId,
                    TeacherId = x.TeacherId
                })
            .ToList();

            response.Data = lecturesToReturn;

            return Ok(response);
        }


        [HttpGet("{lectureId}")]
        public IActionResult GetById([FromRoute] int lectureId)
        {
            var response = new Response();

            var lectureFromDatabase = _dataContext.Lectures.FirstOrDefault(x => x.Id == lectureId);

            if (lectureFromDatabase == null)
            {
                response.AddError("lectureId", "No lectures with the given lectureId");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var lectureToReturn = new LectureGetDto
            {
                Id = lectureFromDatabase.Id,
                LectureName = lectureFromDatabase.LectureName,
                SectionNumber = lectureFromDatabase.SectionNumber,
                ClassTime = lectureFromDatabase.ClassTime,
                RoomId = lectureFromDatabase.RoomId,
                TeacherId = lectureFromDatabase.TeacherId
            };

            response.Data = lectureToReturn;

            return Ok(response);
        }


        [HttpPost("create-lecture")]
        public IActionResult CreateLecture([FromBody] LectureCreateDto lectureCreateDto)
        {
            var response = new Response();

            //check if null
            if (lectureCreateDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //errors for LectureName

            //check if null or empty
            if (string.IsNullOrEmpty(lectureCreateDto.LectureName?.Trim()))
            {
                response.AddError("LectureName", "Cannot be empty");
            }

            //check if null and >= 30
            if (lectureCreateDto.LectureName != null && lectureCreateDto.LectureName.Trim().Length > 8 || lectureCreateDto.LectureName.Trim().Length < 8)
            {
                response.AddError("LectureName", "Abbreviate LectureName (English -> Engl) or check course number (Engl 101)");
            }

            //check if already exists
            var anyLecturesExistWithLectureName = _dataContext.Lectures.Any(x => x.LectureName == lectureCreateDto.LectureName);
            var anyLecturesExistWithSectionNumber = _dataContext.Lectures.Any(x => x.SectionNumber == lectureCreateDto.SectionNumber);

            if (anyLecturesExistWithLectureName && anyLecturesExistWithSectionNumber)
            {
                response.AddError("LectureName", $"{lectureCreateDto.LectureName} with Section {lectureCreateDto.SectionNumber} already exists");
            }

            //errors for SectionNumber

            //check if null or empty
            if (string.IsNullOrEmpty(lectureCreateDto.SectionNumber.ToString()))
            {
                response.AddError("SectionNumber", "Cannot be empty");
            }
            

            //check that section number is between 1 and 10
            if (lectureCreateDto.SectionNumber > 10 || lectureCreateDto.SectionNumber <= 0)
            {
                response.AddError("SectionNumber", "Cannot exceed more than 10");
            }

            //error for roomId
            foreach (var roomId in lectureCreateDto.RoomId.ToString())
            {

                var room = _dataContext.Buildings.FirstOrDefault(x => x.Id == lectureCreateDto.RoomId);

                if (room == null)
                {
                    response.AddError("RoomId", $"Room with Id {lectureCreateDto.RoomId} does not exist");
                }
            }

            //error for teacherId
            foreach (var teacherId in lectureCreateDto.TeacherId.ToString())
            {

                var teacher = _dataContext.Teachers.FirstOrDefault(x => x.Id == lectureCreateDto.TeacherId);

                if (teacher == null)
                {
                    response.AddError("TeacherId", $"Teacher with Id {lectureCreateDto.TeacherId} does not exist");
                }
            }

            //check if any of the responses returned an error

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var lectureToCreate = new Lecture
            {
                LectureName = lectureCreateDto.LectureName,
                SectionNumber = lectureCreateDto.SectionNumber,
                ClassTime = lectureCreateDto.ClassTime,
                RoomId = lectureCreateDto.RoomId,
                TeacherId = lectureCreateDto.TeacherId
            };

            _dataContext.Lectures.Add(lectureToCreate);
            _dataContext.SaveChanges();

            var lectureToReturn = new LectureGetDto
            {
                Id = lectureToCreate.Id,
                LectureName = lectureToCreate.LectureName,
                SectionNumber = lectureToCreate.SectionNumber,
                ClassTime = lectureToCreate.ClassTime,
                RoomId = lectureToCreate.RoomId,
                TeacherId = lectureToCreate.TeacherId
            };

            response.Data = lectureToReturn;

            return Ok(response);
        }

        [HttpPut("edit-lecture/{lectureId:int}")]
        public IActionResult EditLecture([FromRoute] int lectureId, [FromBody] LectureEditDto lectureEditDto)
        {
            var response = new Response();

            var lectureToEdit = _dataContext.Lectures.FirstOrDefault(x => x.Id == lectureId);

            //check for null, return error
            if (lectureEditDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //check for LectureName
            //check if null or empty
            if (string.IsNullOrEmpty(lectureEditDto.LectureName.Trim()))
            {
                response.AddError("LectureName", "Cannot be empty");
            }

            //check if null and == 8 length
            if (lectureEditDto.LectureName != null && lectureEditDto.LectureName.Trim().Length > 8 || lectureEditDto.LectureName.Trim().Length < 8)
            {
                response.AddError("LectureName", "Ex.) Abbreviate Lecture (English -> Engl) or check course number (Engl 101)");
            }

            
            //check if already exists
            /*
            var anyLecturesExistWithSectionNumber = _dataContext.Lectures.Any(x => x.SectionNumber == lectureEditDto.SectionNumber);

            if (anyLecturesExistWithSectionNumber)
            {
              response.AddError("LectureName", $"{lectureEditDto.LectureName} with Section {lectureEditDto.SectionNumber} already exists");
            }
            */
            

            //check for SectionNumber

            //check if null or empty
            if (string.IsNullOrEmpty(lectureEditDto.SectionNumber.ToString()))
            {
                response.AddError("SectionNumber", "Cannot be empty");
            }


            //check that section number is between 1 and 10
            if (lectureEditDto.SectionNumber > 10 || lectureEditDto.SectionNumber <= 0)
            {
                response.AddError("SectionNumber", "Cannot exceed more than 10");
            }

            //error for roomId
            foreach (var roomId in lectureEditDto.RoomId.ToString())
            {

                var room = _dataContext.Buildings.FirstOrDefault(x => x.Id == lectureEditDto.RoomId);

                if (room == null)
                {
                    response.AddError("RoomId", $"Room with Id {lectureEditDto.RoomId} does not exist");
                }
            }

            //error for TeacherId
            foreach (var teacherId in lectureEditDto.TeacherId.ToString())
            {

                var teacher = _dataContext.Teachers.FirstOrDefault(x => x.Id == lectureEditDto.TeacherId);

                if (teacher == null)
                {
                    response.AddError("TeacherId", $"Teacher with Id {lectureEditDto.TeacherId} does not exist");
                }
            }

            //check if any of the responses returned an error

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            //end errors

            lectureToEdit.LectureName = lectureEditDto.LectureName;
            lectureToEdit.SectionNumber = lectureEditDto.SectionNumber;
            lectureToEdit.ClassTime = lectureEditDto.ClassTime;
            lectureToEdit.RoomId = lectureEditDto.RoomId;
            lectureToEdit.TeacherId = lectureEditDto.TeacherId;

            _dataContext.SaveChanges();

            var lectureToReturn = new LectureGetDto
            {
                Id = lectureToEdit.Id,
                LectureName = lectureToEdit.LectureName,
                SectionNumber = lectureToEdit.SectionNumber,
                ClassTime = lectureToEdit.ClassTime,
                RoomId = lectureToEdit.RoomId,
                TeacherId = lectureToEdit.TeacherId
            };

            response.Data = lectureToReturn;

            return Ok(response);
        }

        [HttpDelete("{lectureId}")]
        public IActionResult DeleteLecture([FromRoute] int lectureId)
        {
            var response = new Response();

            var lectureToDelete = _dataContext.Lectures.FirstOrDefault(x => x.Id == lectureId);

            //check errors (check for null)
            if (lectureToDelete == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            _dataContext.Lectures.Remove(lectureToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }
    }
}
