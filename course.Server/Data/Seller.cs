using Microsoft.AspNetCore.Identity;
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
        [ProtectedPersonalData]
        public string Email { get; set; }

        [Required]
        public required string ContractNumber { get; set; }

        /// <summary>
        /// A seller may choose to freeze their seller account
        /// </summary>
        [Required]
        public bool Freezed { get; set; } = false;

        /// <summary>
        /// A seller may be suspended by administration
        /// </summary>
        [Required]
        public bool Suspended { get; set; } = false;
    }
}
