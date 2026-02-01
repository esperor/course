using course.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(StoreId))]
        public Store Store { get; set; }

        [Required]
        public int StoreId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
