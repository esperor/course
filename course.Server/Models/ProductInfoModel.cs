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
        public string? Vendor { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public InventoryRecordInfoModel[]? Records { get; set; }

        public ProductInfoModel() { }

        public ProductInfoModel(Product p)
        {
            Id = p.Id;
            VendorId = p.VendorId;
            Vendor = p.Vendor?.Name;
            Title = p.Title;
            Description = p.Description;
        }

        public ProductInfoModel(Product p, IEnumerable<InventoryRecord>? records)
            : this(p)
        {
            Records =
                records?.Select(r => new InventoryRecordInfoModel
                {
                    Id = r.Id,
                    Price = r.Price,
                    Quantity = r.Quantity,
                    Size = r.Size,
                    Variation = r.Variation,
                    PropertiesJson = r.PropertiesJson,
                    Image = r.Image,
                }).ToArray();
        }

        public ProductInfoModel(ProductOrderingModel p, IEnumerable<InventoryRecord>? records)
            : this((Product)p, records) { }
    }
}
