using course.Server.Data;

namespace course.Server.Models
{
    public class InventoryRecordInfoModel
    {
        public int Id { get; set; }

        public string Size { get; set; }

        public int Quantity { get; set; }

        public int Price { get; set; }

        public InventoryRecordInfoModel() { }
    }
}
