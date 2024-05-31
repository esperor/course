using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("vendors")]
    public class Vendor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string ContactInfo { get; set; }

        [Required]
        public required string ContractNumber { get; set; }
    }
}
