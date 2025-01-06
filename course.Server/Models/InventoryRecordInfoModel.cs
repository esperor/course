using course.Server.Data;

namespace course.Server.Models
{
    public class InventoryRecordInfoModel
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string PropertiesJson { get; set; }

        public int Quantity { get; set; }

        public int Price { get; set; }

        public byte[]? Image { get; set; }

        public InventoryRecordInfoModel() { }

        public InventoryRecordInfoModel(InventoryRecord inventoryRecord)
        {
            Id = inventoryRecord.Id;
            PropertiesJson = inventoryRecord.PropertiesJson;
            Quantity = inventoryRecord.Quantity;
            Price = inventoryRecord.Price;
            Image = inventoryRecord.Image;
            Title = inventoryRecord.Product.Title;
        }
    }
}
