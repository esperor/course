using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class OrderInfoModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Address { get; set; }

        public int TotalPrice { get; set; }

        public DateOnly Date { get; set; }

        public EOrderStatus Status { get; set; }

        // key is record.Id and value is quantity
        public Dictionary<int, int>? OrderedRecords { get; set; }

        public OrderInfoModel() { }

        public OrderInfoModel(Order order)
        {
            Id = order.Id;
            UserId = order.UserId;
            Address = order.Address;
            Date = order.Date;
            Status = order.Status;
        }

        public OrderInfoModel(Order order, Dictionary<InventoryRecord, int> records)
            : this(order)
        {
            TotalPrice = records.Aggregate(0, (acc, r) => acc + r.Value * r.Key.Price);
            OrderedRecords = records
                .Select(pair => new KeyValuePair<int, int>(pair.Key.Id, pair.Value))
                .ToDictionary();
        }
    }
}
