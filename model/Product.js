const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  id:{
    type: String
  },
  sub_name: {
    type: String
  },
  name: {
    type: String
  },
  price: {
    type: String,
    required: true
  },
  promo_price: {
    type: String,
    min: 6
  },
  image: {
    type: String
  },
  updateAt: {
    type: Date,
    default: Date.now
  },
  
})

module.exports = mongoose.model('Product', productSchema)

