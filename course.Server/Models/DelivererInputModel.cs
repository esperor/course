using course.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Models
{
    public class DelivererInputModel
    {
        [Required]
        public int UserId { get; set; }

        [StringLength(200)]
        public string? ContactInfo { get; set; }

        [Required]
        [StringLength(32)]
        public required string ContractNumber { get; set; }

        public Deliverer ToEntity()
        {
            return new Deliverer
            {
                UserId = UserId,
                ContactInfo = ContactInfo,
                ContractNumber = ContractNumber
            };
        }
    }
}
