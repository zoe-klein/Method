using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Entities;
using LearningStarter.Data;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/teachers")]
    public class TeachersController : Controller
    {
        private readonly DataContext _dataContext;

        public TeachersController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpPost("create-teacher")]
        public IActionResult CreateTeacher(TeacherPostDto teacherPostDto)
        {
            var response = new Response();

            if (teacherPostDto == null)
            {
                response.AddError("", "Critical error.");
                return BadRequest(response);
            }

            if (string.IsNullOrWhiteSpace(teacherPostDto.FirstName) || string.IsNullOrEmpty(teacherPostDto.FirstName))
            {
                response.AddError("FirstName", "First name cannot be empty.");
            }
            else if (teacherPostDto.FirstName.Length > 32)
            {
                response.AddError("FirstName", "First name cannot be longer than 32 characters.");
            }

            if (string.IsNullOrWhiteSpace(teacherPostDto.LastName) || string.IsNullOrEmpty(teacherPostDto.LastName))
            {
                response.AddError("FirstName", "Last name cannot be empty.");
            }
            else if (teacherPostDto.LastName.Length > 32)
            {
                response.AddError("LastName", "Last name cannot be longer than 32 characters.");
            }

            var emailExists = _dataContext.Teachers.Any(x => x.Email == teacherPostDto.Email);

            if (teacherPostDto.Email == null)
            {
                response.AddError("Email", "Email cannot be null.");
            }
            else if (emailExists)
            {
                response.AddError("Email", "Email already in use.");
            }

            var phoneNumberExists = _dataContext.Teachers.Any(x => x.PhoneNumber == teacherPostDto.PhoneNumber);

            if (teacherPostDto.PhoneNumber == null)
            {
                response.AddError("PhoneNumber", "Phone number cannot be null");
            }
            else if (phoneNumberExists)
            {
                response.AddError("PhoneNumber", "Phone number already in use.");
            }
            else if (teacherPostDto.PhoneNumber.Replace("-", "").Any(x=> char.IsLetter(x))) {
                response.AddError("PhoneNumber", "Phone number can only contain numbers or dashes.");
            }
            else if (teacherPostDto.PhoneNumber.Replace("-", "").Length != 11) 
            {
                response.AddError("PhoneNumber", "Phone number length must be 11 numbers long. Enter as (X-XXX-XXX-XXXX).");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var teacherToPost = new Teacher
            {
                FirstName = teacherPostDto.FirstName,
                LastName = teacherPostDto.LastName,
                Email = teacherPostDto.Email,
                PhoneNumber = teacherPostDto.PhoneNumber
            };

            _dataContext.Teachers.Add(teacherToPost);
            _dataContext.SaveChanges();

            var teacherToReturn = new TeacherGetDto
            {
                Id = teacherToPost.Id,
                FirstName = teacherToPost.FirstName,
                LastName = teacherToPost.LastName,
                Email = teacherToPost.Email,
                PhoneNumber = teacherToPost.PhoneNumber
            };

            response.Data = teacherToReturn;

            return Ok(response);
        }

        [HttpGet("get-teacher/{teacherId:int}")]
        public IActionResult GetTeacher([FromRoute] int teacherId)
        {
            var response = new Response();

            var teacherFromDatabase = _dataContext.Teachers.FirstOrDefault(x => x.Id == teacherId);

            if (teacherFromDatabase == null)
            {
                response.AddError("teacherId", $"Teacher with ID {teacherId} not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var teacherToReturn = new TeacherGetDto
            {
                Id = teacherFromDatabase.Id,
                FirstName = teacherFromDatabase.FirstName,
                LastName = teacherFromDatabase.LastName,
                Email = teacherFromDatabase.Email,
                PhoneNumber = teacherFromDatabase.PhoneNumber
            };

            response.Data = teacherToReturn;

            return Ok(response);
        }

        [HttpGet]
        public IActionResult GetAllTeachers()
        {
            var response = new Response();

            var teachersToGet = _dataContext.Teachers.Select(teacher => new TeacherGetDto
            {
                Id = teacher.Id,
                FirstName = teacher.FirstName,
                LastName = teacher.LastName,
                Email = teacher.Email,
                PhoneNumber = teacher.PhoneNumber
            }).ToList();

            if (teachersToGet.Capacity == 0)
            {
                response.AddError("teachersToGet", "There are no teachers in the database to get.");
                return Ok(response);
            }

            response.Data = teachersToGet;
            return (Ok(response));
        }

        [HttpPut("edit-teacher/{teacherId:int}")]
        public IActionResult PutTeacher([FromRoute] int teacherId, [FromBody] TeacherPutDto teacherPutDto)
        {
            var response = new Response();

            var teacherToPut = _dataContext.Teachers.FirstOrDefault(x => x.Id == teacherId);

            if (teacherPutDto == null)
            {
                response.AddError("teacherPutDto", "System error.");
            }

            if (teacherToPut == null)
            {
                response.AddError("teacherToPut", "Teacher does not exist in database");
            }

            if (string.IsNullOrWhiteSpace(teacherPutDto.FirstName) || string.IsNullOrEmpty(teacherPutDto.FirstName))
            {
                response.AddError("FirstName", "First name cannot be empty.");
            }
            else if (teacherPutDto.FirstName.Length > 32)
            {
                response.AddError("FirstName", "First name cannot be longer than 32 characters.");
            }

            if (string.IsNullOrWhiteSpace(teacherPutDto.LastName) || string.IsNullOrEmpty(teacherPutDto.LastName))
            {
                response.AddError("FirstName", "First name cannot be empty.");
            }
            else if (teacherPutDto.LastName.Length > 32)
            {
                response.AddError("LastName", "Last name cannot be longer than 32 characters.");
            }

            var emailExists = _dataContext.Teachers.Any(x => x.Email == teacherPutDto.Email);

            if (teacherPutDto.Email == null)
            {
                response.AddError("Email", "Email cannot be null.");
            }
            else if (emailExists && teacherPutDto.Email != teacherToPut.Email)
            {
                response.AddError("Email", "Email already in use.");
            }

            var phoneNumberExists = _dataContext.Teachers.Any(x => x.PhoneNumber == teacherPutDto.PhoneNumber);

            if (teacherPutDto.PhoneNumber == null)
            {
                response.AddError("PhoneNumber", "Phone number cannot be null");
            }
            else if (phoneNumberExists && teacherPutDto.PhoneNumber != teacherToPut.PhoneNumber)
            {
                response.AddError("PhoneNumber", "Phone number already in use.");
            }
            else if (teacherPutDto.PhoneNumber.Replace("-", "").Trim().Any(x => char.IsLetter(x)))
            {
                response.AddError("PhoneNumber", "Phone number can only contain numbers or dashes.");
            }
            else if (teacherPutDto.PhoneNumber.Replace("-", "").Trim().Length != 11)
            {
                response.AddError("PhoneNumber", "Phone number length must be 11 numbers long. Enter as (X-XXX-XXX-XXXX).");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            teacherToPut.FirstName = teacherPutDto.FirstName;
            teacherToPut.LastName = teacherPutDto.LastName;
            teacherToPut.Email = teacherPutDto.Email;
            teacherToPut.PhoneNumber = teacherPutDto.PhoneNumber;

            _dataContext.SaveChanges();

            var teacherToReturn = new TeacherGetDto
            {
                Id = teacherToPut.Id,
                FirstName = teacherToPut.FirstName,
                LastName = teacherToPut.LastName,
                Email = teacherToPut.Email,
                PhoneNumber = teacherToPut.PhoneNumber
            };

            response.Data = teacherToReturn;

            return Ok(response);
        }

        [HttpDelete("delete-teacher/{teacherId:int}")]
        public IActionResult DeleteTeacher([FromRoute] int teacherId) 
        {
            var response = new Response();

            var teacherToDelete = _dataContext.Teachers.FirstOrDefault(x => x.Id == teacherId);

            if (teacherToDelete == null)
            {
                response.AddError("teacherId", $"Teacher with ID {teacherId} not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            _dataContext.Teachers.Remove(teacherToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }
    }
}