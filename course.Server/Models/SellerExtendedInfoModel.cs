using course.Server.Data;

namespace course.Server.Models
{
    public class SellerExtendedInfoModel
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string ContractNumber { get; set; }

        public bool Active { get; set; }

        public bool Freezed { get; set; }

        public bool Suspended { get; set; }

        public SellerExtendedInfoModel() { }

        public SellerExtendedInfoModel(SellerExtended s)
        {
            UserId = s.UserId;
            Name = s.Name;
            Phone = s.Phone;
            Email = s.Email;
            ContractNumber = s.ContractNumber;
            Active = s.Active;
            Freezed = s.Freezed;
            Suspended = s.Suspended;
        }
    }
}
