namespace course.Server.Models
{
    class ProductRecordDbModel : ProductInfoModel
    {
        public int? RecordId { get; set; }
        public int? Quantity { get; set; }
        public int? Price { get; set; }
        public byte[]? Image { get; set; }
        public string? PropertiesJson { get; set; }
        public string? Size { get; set; }
        public string? Variation { get; set; }
    }
}
