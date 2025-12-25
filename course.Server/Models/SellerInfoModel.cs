using course.Server.Data;

namespace course.Server.Models
{
    public class SellerInfoModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string ContractNumber { get; set; }

        public SellerInfoModel() { }

        public SellerInfoModel(Seller s)
        {
            Id = s.User.Id;
            Name = s.User.Name;
            Phone = s.User.Phone;
            Email = s.Email;
            ContractNumber = s.ContractNumber;
        }

        public SellerInfoModel(Seller s, ApplicationUser u)
        {
            Id = u.Id;
            Name = u.Name;
            Phone = u.Phone;
            Email = s.Email;
            ContractNumber = s.ContractNumber;
        }
    }
}
