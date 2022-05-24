using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LearningStarter.Common;
using LearningStarter.Entities;
using LearningStarter.Data;


namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/assignments")]
    public class AssignmentsController : Controller
    {
        private readonly DataContext _dataContext;
        
        public AssignmentsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllAssignments()
        {
            var response = new Response();

            var assignmentsToReturn = _dataContext
                .Assignments
                .Select(item => new AssignmentGetDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Score = item.Score,
                    DueDate = item.DueDate,
                    Description = item.Description
                })
                .ToList();

            if(assignmentsToReturn.Capacity == 0)
            {
                response.AddError("", "There are no assignments to return.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            response.Data = assignmentsToReturn;
            return Ok(response);
        }

        [HttpGet("{assignmentId:int}")]
        public IActionResult GetAssignmentById([FromRoute] int assignmentId)
        {
            var response = new Response();

            var assignmentFromDatabase = _dataContext.Assignments.FirstOrDefault(x => x.Id == assignmentId);

            if (assignmentFromDatabase == null)
            {
                response.AddError("assignmentId", $"No assignments found with the Id of {assignmentId}");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var assignmentToReturn = new AssignmentGetDto
            {
                Id = assignmentFromDatabase.Id,
                Name = assignmentFromDatabase.Name,
                Score = assignmentFromDatabase.Score,
                DueDate = assignmentFromDatabase.DueDate,
                Description = assignmentFromDatabase.Description
            };

            response.Data = assignmentToReturn;

            return Ok(response);
        }

        [HttpPost("assignments-create")]
        public IActionResult CreateAssigment(AssignmentCreateDto assignmentCreateDto)
        {
            var response = new Response();

            if(assignmentCreateDto == null)
            {
                response.AddError("", "System Error, please contact an admin.");
                return BadRequest(response);
            }

            if (string.IsNullOrEmpty(assignmentCreateDto.Name?.Trim()))
            {
                response.AddError("Name", "Name field should not be empty.");
            }

            if (assignmentCreateDto.Name != null && assignmentCreateDto.Name.Length > 50)
            {
                response.AddError("Name", "Assignment name is too long, must be 50 characters or less.");
            }

            if(assignmentCreateDto.Score < 0)
            {
                response.AddError("Score", "Score can not be negative.");
            }

            if(assignmentCreateDto.Score > 100)
            {
                response.AddError("Score", "Score can not be more than 100.");
            }

            if(response.HasErrors)
            {
                return BadRequest(response);
            }

            var assignmentToCreate = new Assignment
            {
                Name = assignmentCreateDto.Name,
                DueDate = assignmentCreateDto.DueDate,
                Score = assignmentCreateDto.Score,
                Description = assignmentCreateDto.Description
            };

            _dataContext.Assignments.Add(assignmentToCreate);
            _dataContext.SaveChanges();

            var assignmentToReturn = new AssignmentGetDto
            {
                Id = assignmentToCreate.Id,
                Name = assignmentToCreate.Name,
                DueDate = assignmentToCreate.DueDate,
                Score = assignmentToCreate.Score,
                Description = assignmentToCreate.Description
            };

            response.Data = assignmentToReturn;

            return Ok(response);
        }
        
        [HttpPut("assignments-edit/{assignmentId:int}")]
        public IActionResult EditAssignment([FromRoute] int assignmentId, [FromBody] AssignmentEditDto assignmentEditDto)
        {
            var response = new Response();

            var assignmentToEdit = _dataContext.Assignments.FirstOrDefault(x => x.Id == assignmentId);

            if (assignmentEditDto == null)
            {
                response.AddError("", "System Error, please contact an admin.");
                return BadRequest(response);
            }

            if (string.IsNullOrEmpty(assignmentEditDto.Name))
            {
                response.AddError("Name", "Name field should not be empty.");
            }

            if (assignmentEditDto.Name != null && assignmentEditDto.Name.Length > 50)
            {
                response.AddError("Name", "Assignment name is too long, must be 50 characters or less.");
            }

            if (assignmentEditDto.Score < 0)
            {
                response.AddError("Score", "Score can not be negative.");
            }

            if (assignmentEditDto.Score > 100)
            {
                response.AddError("Score", "Score can not be more than 100.");
            }

            if (assignmentToEdit == null)
            {
                response.AddError("assignmentId", $"No assignments found with the Id of {assignmentId}");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            assignmentToEdit.Name = assignmentEditDto.Name;
            assignmentToEdit.Score = assignmentEditDto.Score;
            assignmentToEdit.DueDate = assignmentEditDto.DueDate;
            assignmentToEdit.Description = assignmentEditDto.Description;

            _dataContext.SaveChanges();

            var assignmentToReturn = new AssignmentGetDto
            {
                Id = assignmentToEdit.Id,
                Name = assignmentToEdit.Name,
                Score = assignmentToEdit.Score,
                DueDate = assignmentToEdit.DueDate,
                Description = assignmentToEdit.Description

            };

            return Ok(response);
        }

        [HttpDelete("{assignmentId:int}")]
        public IActionResult DeleteAssignment([FromRoute] int assignmentId)
        {
            var response = new Response();

            var assignmentToDelete = _dataContext.Assignments.FirstOrDefault(x => x.Id == assignmentId);

            if (assignmentToDelete == null)
            {
                response.AddError("assignmentId", $"No assignments found with the Id of {assignmentId}");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            _dataContext.Assignments.Remove(assignmentToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }
    }
}