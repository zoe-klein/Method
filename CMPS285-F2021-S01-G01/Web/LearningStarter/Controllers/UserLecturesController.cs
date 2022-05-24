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
    //localhost:5001/...
    [ApiController]
    [Route("api/userLectures")]
    public class UserLecturesController : Controller
    {
        private readonly DataContext _dataContext;
        public UserLecturesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllUserLectures()
        {
            var response = new Response();

            var userLecturesToReturn = _dataContext
                .UserLectures
                .Select(item => new UserLectureGetDto
                {
                    Id = item.Id,
                    UserId = item.UserId,
                    LectureId = item.LectureId,
                })
                .ToList();

            if (userLecturesToReturn.Capacity == 0)
            {
                response.AddError("", "There are no existing UserLectures to return.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            response.Data = userLecturesToReturn;
            return Ok(response);
        }

        [HttpGet("{userLectureId:int}")]
        public IActionResult GetUserLectureById([FromRoute] int userLectureId)
        {
            var response = new Response();

            var userLectureFromDatabase = _dataContext.UserLectures.FirstOrDefault(x => x.Id == userLectureId);

            if (userLectureFromDatabase == null)
            {
                response.AddError("userLectureId", $"No UserLectures found in database with the id of {userLectureId}.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var userLectureToReturn = new UserLectureGetDto
            {
                Id = userLectureFromDatabase.Id,
                UserId = userLectureFromDatabase.UserId,
                LectureId = userLectureFromDatabase.LectureId,
            };

            response.Data = userLectureToReturn;
            return Ok(response);
        }

    }
}
