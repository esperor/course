using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("inventory")]
    public class InventoryRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }      

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int Price { get; set; }

        public string? PropertiesJson { get; set; }

        public byte[]? Image { get; set; }
    }
}
