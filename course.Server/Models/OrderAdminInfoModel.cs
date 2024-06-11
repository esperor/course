using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class OrderAdminInfoModel : OrderInfoModel
    {

        public int? DelivererId { get; set; }

        public OrderAdminInfoModel(Order order) : base(order)
        {
            DelivererId = order.DelivererId;
        }

        public OrderAdminInfoModel(Order order, Dictionary<InventoryRecord, int> records)
            : base(order, records)
        {
            DelivererId = order.DelivererId;
        }
    }
}
