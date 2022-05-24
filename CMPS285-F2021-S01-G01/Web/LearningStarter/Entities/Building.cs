using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class Building
    {
        public int Id { get; set; }
        public string BuildingName { get; set; }
        public List<Room> Rooms { get; set; } = new List<Room>(); //can have many rooms, makes building aware of rooms
    }

    public class BuildingCreateDto
    {
        public string BuildingName { get; set; }
    }

    public class BuildingGetDto
    {
        public int Id { get; set; }
        public string BuildingName { get; set; }
    }

    public class BuildingEditDto
    {
        public int Id { get; set; }
        public string BuildingName { get; set; }
    }

}
