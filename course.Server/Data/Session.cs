using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course.Server.Data
{
    [Table("sessions")]
    public class Session
    {
        [Key]
        public int Id { get; set; }

        public required int UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public required string Cookie {  get; set; }

        public required DateTime CreationTime { get; set; }
    }
}
