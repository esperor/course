using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class OrderAdminInfoModel : OrderInfoModel
    {
        public DelivererInfoModel? Deliverer { get; set; }

        public OrderAdminInfoModel(Order order) : base(order)
        {
            if (order.Deliverer != null)
                Deliverer = new DelivererInfoModel(order.Deliverer);
        }

        public OrderAdminInfoModel(Order order, Dictionary<InventoryRecord, int> records)
            : base(order, records)
        {
            if (order.Deliverer != null)
                Deliverer = new DelivererInfoModel(order.Deliverer);
        }
    }
}
