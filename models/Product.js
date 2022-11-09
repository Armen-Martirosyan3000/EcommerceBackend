//ապրանքների մոդել

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },//ապրանքի անուն(վերնագիր),անունը եզակի է, չի կարող նուն ապրանքը նույն անունով լինել
    desc: { type: String, required: true, },//description-նկարագրությունը
    img: { type: String, required: true },//պատկերը
    categories: { type: Array },//կատեգորիաները, մենք կարող ենք ունենալ մեկից ավելի կատեգորիաներ դրա համար type-ը զանգված է, այս զանգվածի ներսում մենք կարող ենք տեղադրել ցանկացած կատեգորիայի անվանում  
    size: { type: String },//չափը
    color: { type: String },//գույնը
    price: { type: Number, required: true },//ապրանքի գինը
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);