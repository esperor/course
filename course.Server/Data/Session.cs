using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("sessions")]
    public class Session
    {
        [Key]
        public int Id { get; init; }

        public required int UserId { get; init; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; init; }

        public required string Cookie { get; init; }

        public required DateTime CreationTime { get; init; }
    }
}
