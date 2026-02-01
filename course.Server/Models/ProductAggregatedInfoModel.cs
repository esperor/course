using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductAggregatedInfoModel : ProductInfoModel
    {
        [Required]
        public InventoryRecordInfoModel[]? Records { get; set; }

        public ProductAggregatedInfoModel() { }

        public ProductAggregatedInfoModel(Product p)
        {
            Id = p.Id;
            StoreId = p.StoreId;
            StoreName = p.Store?.Name;
            Title = p.Title;
            Description = p.Description;
        }

        public ProductAggregatedInfoModel(Product p, IEnumerable<InventoryRecord>? records)
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
    }
}
