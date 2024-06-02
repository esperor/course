using course.Server.Data;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models.Info
{
    public class DelivererInfoModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public int AccessLevelId { get; set; }

        public string? ContactInfo { get; set; }

        public string ContractNumber { get; set; }

        public DelivererInfoModel(Deliverer d)
        {
            Id = d.User.Id;
            Name = d.User.Name;
            Phone = d.User.Phone;
            AccessLevelId = d.User.AccessLevelId;
            ContactInfo = d.ContactInfo;
            ContractNumber = d.ContractNumber;
        }
    }
}
