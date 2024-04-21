import mongoose from "mongoose";

const certSchema  = new mongoose.Schema({
       
    user: String,
    course: String,
    file: String
 
})

export const cert = mongoose.model("cert",certSchema )