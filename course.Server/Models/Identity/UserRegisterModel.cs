using System.ComponentModel.DataAnnotations;

namespace course.Server.Models.Identity
{
    public class UserRegisterModel : UserLoginModel
    {
        [Required]
        public string Name { get; set; }
    }
}
