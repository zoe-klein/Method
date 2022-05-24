using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public decimal Score { get; set; }
        public string Description { get; set; }
    }

    public class AssignmentCreateDto
    {
        public string Name { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public decimal Score { get; set; }
        public string Description { get; set; }
    }

    public class AssignmentGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public decimal Score { get; set; }
        public string Description { get; set; }
    }

    public class AssignmentEditDto
    {
        public string Name { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public decimal Score { get; set; }
        public string Description { get; set; }
    }
}
