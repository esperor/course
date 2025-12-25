using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class SellerPostModel
    {
        [Required]
        public int UserId { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        public bool ContractConditionsAccepted { get; set; }

        public Seller ToEntity(string contractNumber)
        {
            return new Seller
            {
                UserId = UserId,
                Email = Email,
                ContractNumber = contractNumber
            };
        }
    }
}
