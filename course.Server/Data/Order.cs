using course.Server.Configs.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("orders")]
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; }

        public int? DelivererId { get; set; }

        [ForeignKey(nameof(DelivererId))]
        public Deliverer Deliverer { get; set; }

        public string Address { get; set; }

        public DateOnly Date { get; set; }

        public EOrderStatus Status { get; set; } = EOrderStatus.Created;
    }
}
