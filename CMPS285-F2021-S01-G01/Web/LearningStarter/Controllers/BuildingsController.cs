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
    [Route("api/buildings")]
    public class BuildingsController : Controller
    {
        private readonly DataContext _dataContext;

        public BuildingsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllBuildings()
        {
            var response = new Response();

            var buildingsToReturn = _dataContext
                .Buildings
                .Select(x => new BuildingGetDto
                {
                    Id = x.Id,
                    BuildingName = x.BuildingName,
                })
            .ToList();

            response.Data = buildingsToReturn;

            return Ok(response);
        }

        [HttpGet("get-building/{buildingId:int}")]
        public IActionResult GetById([FromRoute] int buildingId)
        {
            var response = new Response();

            var buildingFromDatabase = _dataContext.Buildings.FirstOrDefault(x => x.Id == buildingId);

            //if null error for Id
            if (buildingFromDatabase == null)
            {
                response.AddError("buildingId", "No Buildings with the given buildingId");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var buildingToReturn = new BuildingGetDto
            {
                Id = buildingFromDatabase.Id,
                BuildingName = buildingFromDatabase.BuildingName,
            };

            response.Data = buildingToReturn;

            return Ok(response);
        }

        [HttpPost("create-building")]
        public IActionResult CreateBuilding(BuildingCreateDto buildingCreateDto)
        {
            var response = new Response();

            //add errors
            if (buildingCreateDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //check if null or empty
            /*
            if (string.IsNullOrEmpty(buildingCreateDto.BuildingName?.Trim()))
            {
                response.AddError("BuildingName", "Cannot be null or empty");
            }
            */

            //check if null and >= 30 and verify it is only letters
            if (buildingCreateDto.BuildingName != null && buildingCreateDto.BuildingName.Trim().Length >= 30)
            {
                response.AddError("BuildingName", "Building Name is too long.");
            } 
            //verify if only letters by gertting rid of spaces and testing each spot of the string
            else if (buildingCreateDto.BuildingName.Replace(" ", "").Any(x=> !char.IsLetter(x))) {
                response.AddError("BuildingName", "The Building Name can only contain letters");
            }

            //check if already exists
            var anyBuildingsExistWithBuildingName = _dataContext.Buildings.Any(x => x.BuildingName == buildingCreateDto.BuildingName);

            if (anyBuildingsExistWithBuildingName)
            {
                response.AddError("BuildingName", $"{buildingCreateDto.BuildingName} already exists");
            }



            //if errors, bad request

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var buildingToCreate = new Building
            {
                BuildingName = buildingCreateDto.BuildingName
            };

            _dataContext.Buildings.Add(buildingToCreate);
            _dataContext.SaveChanges();

            var buildingToReturn = new BuildingGetDto
            {
                Id = buildingToCreate.Id,
                BuildingName = buildingToCreate.BuildingName
            };

            response.Data = buildingToReturn;

            return Ok(response);
        }

        [HttpPut("edit-building/{buildingId:int}")]
        public IActionResult EditBuilding([FromRoute] int buildingId, [FromBody] BuildingEditDto buildingEditDto)
        {
            var response = new Response();

            var buildingToEdit = _dataContext.Buildings.FirstOrDefault(x => x.Id == buildingId);

            //check for null, return error
            if (buildingEditDto == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            //check if null or empty
            /*
            if (string.IsNullOrEmpty(buildingEditDto.BuildingName?.Trim()))
            {
                response.AddError("BuildingName", "Cannot be empty");
            }
            */

            //check if null and >= 30 and verify it is only letters
            if (buildingEditDto.BuildingName != null && buildingEditDto.BuildingName.Trim().Length >= 30)
            {
                response.AddError("BuildingName", "Building Name is too long.");
            }
            //verify if only letters by gertting rid of spaces and testing each spot of the string
            else if (buildingEditDto.BuildingName.Replace(" ", "").Any(x => !char.IsLetter(x)))
            {
                response.AddError("BuildingName", "The Building Name can only contain letters");
            }

            //check if already exists
            var anyBuildingsExistWithBuildingName = _dataContext.Buildings.Any(x => x.BuildingName == buildingEditDto.BuildingName);

            if (anyBuildingsExistWithBuildingName && buildingEditDto.BuildingName != buildingToEdit.BuildingName)
            {
                response.AddError("BuildingName", $"{buildingEditDto.BuildingName} already exists");
            }

            //if errors, bad request

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            buildingToEdit.BuildingName = buildingEditDto.BuildingName;

            _dataContext.SaveChanges();

            var buildingToReturn = new BuildingGetDto
            {
                Id = buildingToEdit.Id,
                BuildingName = buildingToEdit.BuildingName
            };

            response.Data = buildingToReturn;

            return Ok(response);
        }

        [HttpDelete("delete-building/{buildingId:int}")]
        public IActionResult DeleteBuilding([FromRoute] int buildingId)
        {
            var response = new Response();

            var buildingToDelete = _dataContext.Buildings.FirstOrDefault(x => x.Id == buildingId);

            //check errors (check for null)
            if (buildingToDelete == null)
            {
                response.AddError("", "Error. Contact Admin");
                return BadRequest(response);
            }

            _dataContext.Buildings.Remove(buildingToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }

    }
}
