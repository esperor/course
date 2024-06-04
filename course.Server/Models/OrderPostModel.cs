using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class OrderPostModel
    {
        public int? UserId { get; set; }

        public string Address { get; set; }

        // key is record.Id and value is quantity
        public Dictionary<int, int> OrderedRecords { get; set; }

        public Order ToEntity()
        {
            var order = new Order
            {
                Address = Address,
                Status = EOrderStatus.Created,
                Date = DateOnly.FromDateTime(DateTime.Now)
            };
            if (UserId != null) order.UserId = UserId.Value;
            return order;
        }
    }
}
