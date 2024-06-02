using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductPostModel
    {
        [Required]
        public int VendorId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public ProductPostModel() { }

        public Product ToEntity()
        {
            var entity = new Product
            {
                VendorId = VendorId,
                Title = Title,
                Description = Description
            };
            return entity;
        }
    }
}
