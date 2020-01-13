var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost:27017/login_flutter",{ useNewUrlParser: true, useUnifiedTopology: true });

var email_match = [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"Coloca un email valido"];

var user_schema = new Schema({
   _id: mongoose.Schema.Types.ObjectId,
   email:{type: String,required: "El correo es obligatorio",match:email_match},
   pass: { type:String, minlength:[8,"La contraseña es muy corta"], required: "La contraseña es obligatoria"}
});

var User = mongoose.model("User", user_schema);
 
module.exports.User = User;