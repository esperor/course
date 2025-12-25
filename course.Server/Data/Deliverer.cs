using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("deliverers")]
    public class Deliverer
    {
        [Key]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }

        public string? ContactInfo { get; set; }

        [Required]
        public required string ContractNumber { get; set; }
    }
}
