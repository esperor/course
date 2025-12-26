using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Keyless]
    [Table("seller_extended")]
    public class SellerExtended
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        [Phone]
        public string Phone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string ContractNumber { get; set; }

        public bool Active { get; set; }

        public bool Freezed { get; set; }

        public bool Suspended { get; set; }
    }
}
