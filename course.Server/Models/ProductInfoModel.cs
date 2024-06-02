using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductInfoModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public InventoryRecordInfoModel[]? Records { get; set; }

        public ProductInfoModel() { }

        public ProductInfoModel(Product p, IEnumerable<InventoryRecord>? records)
        {
            Id = p.Id;
            VendorId = p.VendorId;
            Title = p.Title;
            Description = p.Description;
            Records =
                records?.Select(r => new InventoryRecordInfoModel
                {
                    Price = r.Price,
                    Quantity = r.Quantity,
                    Size = r.Size,
                }).ToArray();
        }

        public ProductInfoModel(ProductOrderingModel p, IEnumerable<InventoryRecord>? records)
            : this((Product)p, records) { }
    }
}
