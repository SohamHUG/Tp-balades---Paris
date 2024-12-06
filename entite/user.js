import { Schema, model } from "mongoose"

const schema_user = new Schema({
    "email" : {
        type : String ,
        required : [true , "le champ email est obligatoire"],
        minlength : [3 , "le email contient au minimum 3 lettres"],
        maxlength : [255 , "le email contient au minimum 255 lettres"],
    },
    "password" :{
        type : String ,
        required: true
    }
})

const User = model("user", schema_user);

export default User; 