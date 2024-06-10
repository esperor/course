using course.Server.Configs.Enums;
using course.Server.Data;

namespace course.Server.Models
{
    public class UserAdminInfoModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public EAccessLevel AccessLevel { get; set; }

        public UserAdminInfoModel() { }
        public UserAdminInfoModel(ApplicationUser user)
        {
            Id = user.Id;
            Name = user.Name;
            Phone = user.Phone;
            AccessLevel = user.GetAccessLevel();
        }
    }
}
