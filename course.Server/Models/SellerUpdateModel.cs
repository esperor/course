using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class SellerUpdateModel
    {
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        public string ContractNumber { get; set; }

        public Seller ToEntity(int userId)
        {
            return new Seller
            {
                UserId = userId,
                Email = Email,
                ContractNumber = ContractNumber
            };
        }
    }
}
