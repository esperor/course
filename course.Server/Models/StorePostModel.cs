using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class StorePostModel
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required int OwnerId { get; set; }

        public Store ToEntity()
        {
            return new Store
            {
                Name = Name,
                OwnerId = OwnerId
            };
        }
    }
}
