using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class SellerUpdateModel
    {
        [Required]
        public int UserId { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        public string ContractNumber { get; set; }

        public Seller ToEntity()
        {
            return new Seller
            {
                UserId = UserId,
                Email = Email,
                ContractNumber = ContractNumber
            };
        }
    }
}
