const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  title: {
    type: String,
    maxlength:50
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default:0
  },
  images: {
    type: Array,
    default: []
  },
  sold: {
    type: Number,
    maxlength: 100,
    default: 0
  },
  continents:{
    type:Number,
    default:1
  },

  views: {
    type: Number,
    default: 0
  } 
},{timestamps:true});

productSchema.index({ // 검색이 어디에 걸려야 하는지 결정해주기
  title:'text',
  description:'text'
},{
  weights:{
    title:5,
    description:1
  }
})

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
