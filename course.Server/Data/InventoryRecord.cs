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

        /// <summary>
        /// Size for clothes, NULL otherwise.
        /// </summary>
        public string? Size { get; set; }

        /// <summary>
        /// Name for this inventory record as it will be seen by a customer.
        /// </summary>
        [Required]
        public string Variation { get; set; }

        /// <summary>
        /// Additional variation properties, unique for each product.
        /// For example: battery capacity, display type or fabric of the clothing piece.
        /// </summary>
        public string? PropertiesJson { get; set; }

        public byte[]? Image { get; set; }
    }
}
