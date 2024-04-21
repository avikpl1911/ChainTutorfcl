import mongoose from "mongoose";

const courseSchema  = new mongoose.Schema({
       name: {
        type: String,
        required: true,
       
       },
       sections: [{
        doctype: String,
        url : String,
        sectionname: String,
       }],
       img:String,
       OriginalOwner: String,
       price: Number,
 
})

export const course = mongoose.model("asset",courseSchema )