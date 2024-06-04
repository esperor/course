using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("order_record")]
    [PrimaryKey(nameof(OrderId), nameof(InventoryRecordId))]
    public class OrderRecord
    {
        [Required]
        public int OrderId { get; set; }

        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; }

        [Required] 
        public int InventoryRecordId { get; set; }

        [ForeignKey(nameof(InventoryRecordId))]
        public InventoryRecord Record { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
