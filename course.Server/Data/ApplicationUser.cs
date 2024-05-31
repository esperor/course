using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("users")]
    public class ApplicationUser
    {
        [Key]
        [PersonalData]
        public int Id { get; set; }

        public required string Name { get; set; }

        [Phone]
        [ProtectedPersonalData]
        public required string Phone { get; set; }

        public string? PasswordHash { get; set; }

        public required int AccessLevelId { get; set; }

        [ForeignKey(nameof(AccessLevelId))]
        public AccessLevel AccessLevel { get; set; }
    }
}
