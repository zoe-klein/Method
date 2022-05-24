using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleType { get; set; }
    }

    public class RolePostDto
    {
        public string RoleType { get; set; }
    }

    public class RoleGetDto
    {
        public int Id { get; set; }
        public string RoleType { get; set; }
    }

    public class RolePutDto
    {
        public string RoleType { get; set; }
    }
}
