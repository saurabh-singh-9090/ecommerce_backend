const mongoose=require('mongoose'); //to create schema
const crypto=require('crypto');     //to hash(encrypt) the password
const uuidv1=require('uuid/v1');    //to genearate a random string of data which is then stored in salt

var userSchema= new mongoose.Schema({
     name:{
         type: String,
         required: true,
         maxlength: 32,
         trim: true //to remove extra spaces
     }, 
     lastname:{
         type: String,
         maxlength: 32,
         trim: true
     },
     email:{
         type: String,
         required: true,
         trim: true,
         unique: true
     },
     userinfo:{
         type: String,
         trim: true
     },
     encry_password:{
        type: String,
        required: true
    },
     salt:String,
     role:{
        type: Number,
        default: 0 //higher the no. higher the authority
    },
     purchases:{
        type: Array,
        default : []
    }

},
{timestamps: true}
);

//virtual is used here to convert password into encrypted form and then store it in the database
//NOTE: Virtuals are not stored in database
userSchema.virtual("password")
     .set(function(password){
         this._password = password;
         this.salt = uuidv1();
         this.encry_password = this.securePassword(password);
     })
     .get(function(){
         return this._password;
     });

userSchema.methods = {
    authenticate:function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword:function(plainpassword){
        if(!plainpassword) return ""; 
        try {
            //To convert plainpassword entered by user into hashed password
            //NOTE: salt is appended to user's password(like mypasswordE2G5G89) and then is converted to a hashed value which is then stored in the database
            //NOTE: "sha256" stands for 'Secure Hash Algorithm' which outputs a hash value of 256 bits
            return crypto.createHmac('sha256', this.salt) //salt is the random secret key here
                         .update(plainpassword)
                         .digest('hex');
        } catch (err) {
            return "";    //empty passwords can't be stored in MongodB
        }
    }
};

module.exports = mongoose.model("User", userSchema);