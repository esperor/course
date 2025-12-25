using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("sellers")]
    public class Seller
    {
        [Key]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public required string ContractNumber { get; set; }
    }
}
