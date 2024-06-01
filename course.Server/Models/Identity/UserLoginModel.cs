using System.ComponentModel.DataAnnotations;

namespace course.Server.Models.Identity
{
    public class UserLoginModel
    {
        [Required]
        public string Phone { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
