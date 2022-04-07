import User from "../models/user";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be min 6 characters long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");
  // register
  const user = new User(req.body);
  try {
    await user.save();
    //console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req,res) => {
  //console.log(req.body)
  const {email,password} = req.body
  try{
    //Check if user with that email exist
    let user = await User.findOne({email}).exec();
    if(!user) res.status(400).send("User with that email not found")
    //compare password
    user.comparePassword(password,(err,match) => {
      //console.log("Error al comparar las claves",err)
      if(!match || err) return res.status(400).send('Clave incorrecta');
      //('Generar un token entonces mandar una respuesta al cliente')
      let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{
        expiresIn: "7d"
      })
      res.json({token,user:{
        _id: user._id,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        name:user.name,
        email:user.email
      }});
    })
  }catch(err){
    console.log('Error login',err)
    res.status(400).send('Signin failed')
  }
}