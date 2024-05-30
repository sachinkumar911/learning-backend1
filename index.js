const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")

const app = express()

const port = 3000
//middleware use kr rha hun
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//setting up view engine to show ejs file ejs means dynamic html file 
app.set("view engine", "ejs");

// conecting database  mongoose
mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "backend" }).then(() => console.log("data base connected")).catch((e) => console.log(e))

// making schema basically structure of the data-->
const userschema = mongoose.Schema(
  {
    email: String,
    password: String
  }
)

// after making schema we have to make collection of data
const user = mongoose.model("UserData", userschema)




app.get('/add', (req, res) => {
  // const pt = path.resolve();
  // res.sendFile(path.join(pt, "./index.html"))
  // 
  res.send(" hi am logged in check cookie now")

})

app.get('/', (req, res) => {
  const { token } = req.cookies

  if (token) {
    const decode = jwt.verify(token,"ashfbakjfalalkffnjas")
    // console.log(decode)
    res.render("logout")
    // res.render("index")

  }
  else {
    res.render("login")
  }


})

//post method for login page
app.post('/login', async (req, res) => {

  const { email, password } = req.body;
  const users = await user.create({
    email,
    password

  })
  const token = jwt.sign({_id: user._id},"ashfbakjfalalkffnjas")
  //  console.log("=>"+token);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000)
  })
  res.redirect("/")

})

//logout page
app.get("/logout", (req, res) => {

  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.redirect("/")

})



app.get('/success', (req, res) => {
  res.send("message succesfully sent")
})

app.post('/emmail', async (req, res) => {
  const mess = {
    name: req.body.name,
    email: req.body.email
  }
  console.log(mess)
  await message.create(mess)
  res.redirect("/success")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})






