using course.Server.Data;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class DelivererInfoModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public int AccessLevelId { get; set; }

        public string? ContactInfo { get; set; }

        public string ContractNumber { get; set; }

        public DelivererInfoModel() { }

        public DelivererInfoModel(Deliverer d)
        {
            Id = d.User.Id;
            Name = d.User.Name;
            Phone = d.User.Phone;
            AccessLevelId = d.User.AccessLevelId;
            ContactInfo = d.ContactInfo;
            ContractNumber = d.ContractNumber;
        }

        public DelivererInfoModel(Deliverer d, ApplicationUser u)
        {
            Id = u.Id;
            Name = u.Name;
            Phone = u.Phone;
            AccessLevelId = u.AccessLevelId;
            ContactInfo = d.ContactInfo;
            ContractNumber = d.ContractNumber;
        }
    }
}
