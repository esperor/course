using course.Server.Data;

namespace course.Server.Models
{
    public class StoreInfoModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public StoreInfoModel(Store store)
        {
            Id = store.Id;
            Name = store.Name;
        }
    }
}
