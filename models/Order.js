//order-պատվեր, Коллекция заказов
const mongoose = require("mongoose");

//այս պատվերի համաձայն մենք կարող ենք ուղարկել մեր հաճախորդներին
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },//պատվիրող user-ի ID, user-ի(օգտագործող) նույնականացուցիչը
    products: [//պատվիրվող ապրանքներ
      {
        productId: {//պատվիրվող ապրանքի ID, ապրանքի նույնականացուցիչը
          type: String,
        },
        quantity: {//պատվիրվող ապրանքի քանակ
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },//պատվիրվող ապրանքների գումարն է, որը նշված է թիվ և գումարը պարտադիր է(required: true)
    address: { type: Object, required: true },//գնորդի(պատվիրատուի) հասցե, գնելուց հետո գրադարանը մեզ կվերադարձնի օբյեկտ որ մենք կարողանանք օգտագործել, որովհետև այն կներառի մի քանի տողեր, քաղաքը պետությունը և այլ ինֆորմացիա, դրա համար մենք կկարողանանք գրել այստեղ օբյեկտ և վերցնել հասցեի հետ կապված ամբողջ ինֆորմացիան
    status: { type: String, default: "pending" },//status-կարգավիճակ, տիպը տեքստ է դիֆոլտ իրեն կտանք pending(սպասման մեջ) արժեքը, քանի որ գնումից հետո ապրանքը առաքելուց հետո մենք սպասում ենք, և երբ օգտվողը ստանա իր պատվերը այստեղ pending(սպասման մեջ)-ը կդարձնենք ստացված կամ նման մի բան
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);