using course.Server.Data;

namespace course.Server.Models
{
    public class InventoryRecordInfoModel
    {
        public string Size { get; set; }

        public int Quantity { get; set; }

        public int Price { get; set; }

        public InventoryRecordInfoModel() { }

        public InventoryRecord ToEntity()
        {
            var entity = new InventoryRecord
            {
                Size = Size,
                Quantity = Quantity,
                Price = Price
            };
            return entity;
        }
    }
}
