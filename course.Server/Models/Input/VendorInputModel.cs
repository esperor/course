using course.Server.Data;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models.Input
{
    public class VendorInputModel
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string ContactInfo { get; set; }

        [Required]
        public required string ContractNumber { get; set; }

        public Vendor ToEntity()
        {
            return new Vendor
            {
                Name = Name,
                ContactInfo = ContactInfo,
                ContractNumber = ContractNumber
            };
        }
    }
}
