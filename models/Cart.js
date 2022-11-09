//Пользовательские карточки продуктов-ապրանքների համար նախատեսված սայլակ
//ապրանքներն են մեր զամբյուղի(սայլակի) մեջ

const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },//յուրաքանչյուր օգտվող ունի 1 քարտ, այն տեքստային է և այն պարտադիր է
    products: [//կարող են լինել մի քանի ապրանքներ դրա համար ստեղծում ենք զանգված
      {
        productId: {//ապրանքի Id-ն է սահմավում սրանով
          type: String,//որի տիպը տեքստ է
        },
        quantity: {//ապրանքների քանակն է սրանով ապահովվում
          type: Number,//այն թիվ է
          default: 1,//և default երբ մենք ստեղծենք որևէ ապրանք մեր զամբյուղի մեջ այն կլինի ընդամենը 1 և օգտվողը(user) կարող է ավելացնել և նվազեցնել այս թիվը
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);