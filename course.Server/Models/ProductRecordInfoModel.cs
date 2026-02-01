using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class ProductRecordInfoModel : ProductInfoModel
    {
        [Required]
        public InventoryRecordInfoModel? Record { get; set; }
    }
}
