using course.Server.Data;
using course.Server.Configs.Enums;

namespace course.Server.Models.Identity
{   
    public class UserModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public EAccessLevel AccessLevel { get; set; }
        public bool IsRegisteredSeller { get; set; }
    }

    public class UserInfoModel
    {
        public bool IsSignedIn { get; set; } = false;
        public UserModel? Info { get; set; }

        public UserInfoModel() { }
        public UserInfoModel(ApplicationUser user, bool isSeller)
        {
            IsSignedIn = true;
            Info = new UserModel
            {
                Id = user.Id,
                Name = user.Name,
                Phone = user.Phone,
                AccessLevel = user.GetAccessLevel(),
                IsRegisteredSeller = isSeller
            };
        }
    }
}
