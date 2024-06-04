using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class OrderAdminInfoModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int? DelivererId { get; set; }

        public string Address { get; set; }

        public DateOnly Date { get; set; }

        public EOrderStatus Status { get; set; } = EOrderStatus.Created;

        // key is record.Id and value is quantity
        public Dictionary<int, int> OrderedRecords { get; set; }

        public OrderAdminInfoModel(Order order)
        {
            Id = order.Id;
            UserId = order.UserId;
            Address = order.Address;
            Date = order.Date;
            DelivererId = order.DelivererId;
        }

        public OrderAdminInfoModel(Order order, IEnumerable<OrderRecord> records)
            : this(order)
        {
            OrderedRecords = records
                .Select(r => new KeyValuePair<int, int>(r.InventoryRecordId, r.Quantity))
                .ToDictionary();
        }
    }
}
