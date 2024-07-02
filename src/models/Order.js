import mongoose ,{ Schema } from "mongoose";

const orderSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
     img: {
        type: String,
        required: true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    }

},{timestamps:true});

export default mongoose.models.Order || mongoose.model('Order',  orderSchema)