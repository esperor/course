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

        [ForeignKey(nameof(VendorId))]
        public Vendor Vendor { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public static explicit operator Product(ProductOrderingModel model)
        {
            var p = new Product();
            p.Id = model.Id;
            p.VendorId = model.VendorId;
            p.Title = model.Title;
            p.Description = model.Description;
            return p;
        }
    }
}
