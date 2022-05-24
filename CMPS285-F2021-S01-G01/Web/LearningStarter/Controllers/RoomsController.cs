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
    [Route("api/rooms")]
    public class RoomsController : Controller
    {
        private readonly DataContext _dataContext;

        public RoomsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllRooms()
        {
            var response = new Response();

            var roomsToReturn = _dataContext
                .Rooms
                .Select(x => new RoomGetDto
                {
                    Id = x.Id,
                    RoomNumber = x.RoomNumber,
                    BuildingId = x.BuildingId
                })
            .ToList();

            response.Data = roomsToReturn;

            return Ok(response);
        }

        [HttpGet("get-room/{roomId:int}")]
        public IActionResult GetById([FromRoute] int roomId)
        {
            var response = new Response();

            var roomFromDatabase = _dataContext.Rooms.FirstOrDefault(x => x.Id == roomId);

            if (roomFromDatabase == null)
            {
                response.AddError("roomId", "No rooms with the given roomId");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var roomToReturn = new RoomGetDto
            {
                Id = roomFromDatabase.Id,
                RoomNumber = roomFromDatabase.RoomNumber,
                BuildingId = roomFromDatabase.BuildingId
            };

            response.Data = roomToReturn;

            return Ok(response);
        }

        [HttpPost("create-room")]
        public IActionResult CreateRoom([FromBody] RoomCreateDto roomCreateDto)
        {
            var response = new Response();

            //check if null
            if (roomCreateDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //errors for RoomNumber

            //check if null or empty
            if (string.IsNullOrEmpty(roomCreateDto.RoomNumber.ToString()))
            {
                response.AddError("RoomNumber", "Cannot be empty");
            }

            //check if they are entering chars
            //this doesnt work but we'll come back to it later
            /*
            if (roomCreateDto.RoomNumber.ToString().Any(x => char.IsLetter(x)))
            {
                response.AddError("RoomNumber", "Room Number cannot be a letter");
            }
            */

            //add error for negative numbers
            if (roomCreateDto.RoomNumber < 0)
            {
                response.AddError("RoomNumber", "Room Number cannot be negative");
            }

            //add error for numbers in the 500s+
            if (roomCreateDto.RoomNumber > 500)
            {
                response.AddError("RoomNumber", "Room Number cannot be more than 500");
            }

            /*
            //check if already exists (not needed since multiple rooms can be in multiple buildings)
            var anyRoomsExistWithRoomNumber = _dataContext.Rooms.Any(x => x.RoomNumber == roomCreateDto.RoomNumber);

            if (anyRoomsExistWithRoomNumber)
            {
                response.AddError("RoomNumber", $"{roomCreateDto.RoomNumber} already exists");
            }
            */

            //errors for buildingId

            //check if null or empty
            if (string.IsNullOrEmpty(roomCreateDto.BuildingId.ToString()))
            {
                response.AddError("BuildingId", "Cannot be empty");
            }

            //can have the same building - does not need error

            //check if the Id is in the database, return error if not
            
            foreach (var buildingId in roomCreateDto.BuildingId.ToString())
            {

                var building = _dataContext.Buildings.FirstOrDefault(x => x.Id == roomCreateDto.BuildingId);

                if (building == null)
                {
                    response.AddError("BuildingId", $"Building with Id {roomCreateDto.BuildingId} does not exist");
                }
            }
            

            //check if any of the responses returned an error

            if (response.HasErrors)
            {
               return BadRequest(response);
            }

            var roomToCreate = new Room
            {
               RoomNumber = roomCreateDto.RoomNumber,
               BuildingId = roomCreateDto.BuildingId
            };

            _dataContext.Rooms.Add(roomToCreate);
            _dataContext.SaveChanges();

            var roomToReturn = new RoomGetDto
            {
                Id = roomToCreate.Id,
                RoomNumber = roomToCreate.RoomNumber,
                BuildingId = roomToCreate.BuildingId
            };

            response.Data = roomToReturn;

            return Ok(response);
        }

        [HttpPut("edit-room/{roomId:int}")]
        public IActionResult EditRoom([FromRoute] int roomId, [FromBody] RoomEditDto roomEditDto)
        {
            var response = new Response();

            var roomToEdit = _dataContext.Rooms.FirstOrDefault(x => x.Id == roomId);

            //check for null, return error
            if (roomEditDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //check if null or empty
            if (string.IsNullOrEmpty(roomEditDto.RoomNumber.ToString()))
            {
                response.AddError("RoomNumber", "Cannot be empty");
            }

            //check if null or empty
            if (string.IsNullOrEmpty(roomEditDto.RoomNumber.ToString()))
            {
                response.AddError("RoomNumber", "Cannot be empty");
            }

            //add error for negative numbers
            if (roomEditDto.RoomNumber < 0)
            {
                response.AddError("RoomNumber", "Room Number cannot be negative");
            }

            //add error for numbers in the 500s+
            if (roomEditDto.RoomNumber > 500)
            {
                response.AddError("RoomNumber", "Room Number cannot be more than 500");
            }

            //check if already exists
            var anyRoomsExistWithRoomNumber = _dataContext.Rooms.Any(x => x.RoomNumber == roomEditDto.RoomNumber);

            if (anyRoomsExistWithRoomNumber && roomEditDto.RoomNumber != roomToEdit.RoomNumber)
            {
                response.AddError("RoomNumber", $"{roomEditDto.RoomNumber} already exists");
            }

            //error for buildingId
            foreach (var buildingId in roomEditDto.BuildingId.ToString())
            {

                var building = _dataContext.Buildings.FirstOrDefault(x => x.Id == roomEditDto.BuildingId);

                if (building == null)
                {
                    response.AddError("BuildingId", $"Building with Id {roomEditDto.BuildingId} does not exist");
                }
            }

            //check if any of the responses returned an error

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            roomToEdit.RoomNumber = roomEditDto.RoomNumber;
            roomToEdit.BuildingId = roomEditDto.BuildingId;
            _dataContext.SaveChanges();

            var roomToReturn = new RoomGetDto
            {
                Id = roomToEdit.Id,
                RoomNumber = roomToEdit.RoomNumber,
                BuildingId = roomToEdit.BuildingId
            };

            response.Data = roomToReturn;

            return Ok(response);
        }

        [HttpDelete("delete-room/{roomId:int}")]
        public IActionResult DeleteRoom([FromRoute] int roomId)
        {
            var response = new Response();

            var roomToDelete = _dataContext.Rooms.FirstOrDefault(x => x.Id == roomId);

            //check errors (check for null)
            if (roomToDelete == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            _dataContext.Rooms.Remove(roomToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }

    }
}
