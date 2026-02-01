using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductInfoModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int StoreId { get; set; }

        [Required]
        public string? StoreName { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
