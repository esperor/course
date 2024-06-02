using course.Server.Data;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Models
{
    public class ProductOrderingModel
    {
        public int Id { get; set; }

        public int VendorId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public int Price { get; set; }

        public ProductOrderingModel() { }

        public ProductOrderingModel(Product p, IEnumerable<InventoryRecord> records)
        {
            Id = p.Id;
            VendorId = p.VendorId;
            Title = p.Title;
            Description = p.Description;
            Quantity = records.Sum(r => r.Quantity);
            Price = records.Max(r => r.Price);
        }
    }
}
