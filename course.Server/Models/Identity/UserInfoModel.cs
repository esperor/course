using course.Server.Data;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using course.Server.Configs.Enums;

namespace course.Server.Models.Identity
{
    public class UserInfoModel
    {
        public bool IsSignedIn { get; set; } = false;
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public EAccessLevel? AccessLevel { get; set; }

        public UserInfoModel() { }
        public UserInfoModel(ApplicationUser user)
        {
            IsSignedIn = true;
            Name = user.Name;
            Phone = user.Phone;
            AccessLevel = user.GetAccessLevel();
        }
    }
}
