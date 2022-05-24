using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/roles")]
    public class RolesController : Controller
    {
        private readonly DataContext _dataContext;

        public RolesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpPost]
        public IActionResult PostRole(RolePostDto rolePostDto)
        {
            var response = new Response();

            if (rolePostDto == null)
            {
                response.AddError("", "Critical error.");
                return BadRequest(response);
            }

            if (string.IsNullOrWhiteSpace(rolePostDto.RoleType) || string.IsNullOrEmpty(rolePostDto.RoleType))
            {
                response.AddError("RoleType", "Role cannot be empty.");
            }
            else if (rolePostDto.RoleType.Length > 16)
            {
                response.AddError("RoleType", "Role cannot be longer than 16 characters.");
            }

            var roleExists = _dataContext.Roles.Any(x => x.RoleType == rolePostDto.RoleType);

            if (rolePostDto.RoleType == null)
            {
                response.AddError("RoleType", "Role cannot be null.");
            }
            else if (roleExists)
            {
                response.AddError("RoleType", "Role already exists.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var roleToPost = new Role
            {
                RoleType = rolePostDto.RoleType
            };

            _dataContext.Roles.Add(roleToPost);
            _dataContext.SaveChanges();

            var roleToReturn = new RoleGetDto
            {
                Id = roleToPost.Id,
                RoleType = roleToPost.RoleType
            };

            response.Data = roleToReturn;

            return Ok(response);
        }

        [HttpGet("{roleId:int}")]
        public IActionResult GetRole([FromRoute] int roleId)
        {
            var response = new Response();

            var roleFromDatabase = _dataContext.Roles.FirstOrDefault(x => x.Id == roleId);

            if (roleFromDatabase == null)
            {
                response.AddError("roleId", $"Role with ID {roleId} not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var roleToReturn = new RoleGetDto
            {
                Id = roleFromDatabase.Id,
                RoleType = roleFromDatabase.RoleType
            };

            response.Data = roleToReturn;

            return Ok(response);
        }

        [HttpGet]
        public IActionResult GetAllRoles()
        {
            var response = new Response();

            var rolesToGet = _dataContext.Roles.Select(role => new RoleGetDto
            {
                Id = role.Id,
                RoleType = role.RoleType
            }).ToList();

            if (rolesToGet.Capacity == 0)
            {
                response.AddError("rolesToGet", "There are no roles in the database to get.");
                return Ok(response);
            }

            response.Data = rolesToGet;

            return Ok(response);
        }

        [HttpPut("{roleId:int}")]
        public IActionResult PutRole([FromRoute] int roleId, [FromBody] RolePutDto rolePutDto)
        {
            var response = new Response();

            var roleToPut = _dataContext.Roles.FirstOrDefault(x => x.Id == roleId);

            if (rolePutDto == null)
            {
                response.AddError("rolePutDto", "System error.");
            }

            if (roleToPut == null)
            {
                response.AddError("roleToPut", "Role does not exist in database.");
            }

            if (string.IsNullOrWhiteSpace(rolePutDto.RoleType) || string.IsNullOrEmpty(rolePutDto.RoleType))
            {
                response.AddError("RoleType", "Role cannot be empty.");
            }
            else if (rolePutDto.RoleType.Length > 16)
            {
                response.AddError("RoleType", "Role cannot be longer than 16 characters.");
            }

            var roleExists = _dataContext.Roles.Any(x => x.RoleType == rolePutDto.RoleType);

            if (rolePutDto.RoleType == null)
            {
                response.AddError("RoleType", "Role cannot be null.");
            }
            else if (roleExists)
            {
                response.AddError("RoleType", "Role already exists");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            roleToPut.RoleType = rolePutDto.RoleType;

            _dataContext.SaveChanges();

            var roleToReturn = new RoleGetDto
            {
                Id = roleToPut.Id,
                RoleType = roleToPut.RoleType
            };

            response.Data = roleToReturn;

            return Ok(response);
        }

        [HttpDelete("{roleId:int}")]
        public IActionResult DeleteRole([FromRoute] int roleId)
        {
            var response = new Response();

            var roleToDelete = _dataContext.Roles.FirstOrDefault(x => x.Id == roleId);

            if (roleToDelete == null)
            {
                response.AddError("roleId", $"Role with ID {roleId} not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            _dataContext.Roles.Remove(roleToDelete);
            _dataContext.SaveChanges();

            return Ok(response);
        }
    }
}
