using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductPutModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int StoreId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public Product ToEntity()
        {
            var entity = new Product
            {
                Id = Id,
                StoreId = StoreId,
                Title = Title,
                Description = Description
            };
            return entity;
        }
    }
}
