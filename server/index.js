import express from "express";
import mongoose from "mongoose";
import { user } from "./db/user.js";
import cors from "cors";
import { course } from "./db/course.js";
import fs from "fs";
import * as fcl from "@onflow/fcl";
import makepdf from "./pdf/make.js";
import { cert } from "./db/certs.js";

fcl.config({
  "accessNode.api": "http://localhost:8888",
  "flow.network": "local",
  env: "local",
});
const app = express();
app.use(cors());
app.use(express.json({ limit: "200mb" }));

const initdb = () => {
  mongoose
    .connect("mongodb://localhost:27017/myflowapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};

initdb();

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/img/course/:imgid", (req, res) => {
  res.sendFile(process.cwd() + "/images/course/" + req.params.imgid);
});

app.post("/newuser", async (req, res) => {
  console.log(req.body.address);
  const existingUser = await user.findOne({ address: req.body.address });

  if (existingUser) {
    res.status(500);
  } else {
    const newUser = new user({
      address: req.body.address,
    });
    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (e) {
      console.error(e);
    }
  }
});

app.get("/user/:id", async (req, res) => {
  const userinfo = await user.findOne({ address: req.params.id });
  res.status(200).json(userinfo);
});

app.post("/uploadcourse", async (req, res) => {
  const decodedData = Buffer.from(req.body.img.split(",")[1], "base64");
  const filename = Date.now() + ".jpg";
  fs.writeFile("images/course/" + filename, decodedData, async (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "server error", status: 1 });
    }
  });
  const newcourse = new course({
    name: req.body.name,
    sections: req.body.sections,
    OriginalOwner: req.body.user,
    img: filename,
    price: req.body.price,
  });
  const savedcourse = await newcourse.save();
  const addtouser = await user.findOneAndUpdate(
    { address: req.body.user },
    { $push: { producedcourses: savedcourse._id } }
  );
  res.status(200).json({ status: 200 });
});

app.get("/courses", async (req, res) => {
  const courseswidsome = await course.find().select(["name", "img", "price"]);
  res.status(200).json(courseswidsome);
});

app.get("/course/:id", async (req, res) => {
  try {
    const getcourse = await course
      .findById(req.params.id)
      .select(["name", "img", "price", "OriginalOwner"]);
    res.status(200).json(getcourse);
  } catch (e) {
    res.status(404).json({});
  }
});

app.post("/buy", async (req, res) => {
  try {
    const status = await fcl
      .send([fcl.getTransactionStatus(req.body.txid)])
      .then(fcl.decode);
    console.log(req.body);
    const found_course = await course.findById(req.body.courseid);
    // console.log(found_course.OriginalOwner == status.events[1].data.to);
    // console.log(status.events[0].data.from == req.body.user);
    // console.log(found_course.price == Number(status.events[1].data.amount));
    if (status.statusCode == 0) {
      if (
        found_course.OriginalOwner == status.events[1].data.to &&
        status.events[0].data.from == req.body.user &&
        found_course.price == Number(status.events[1].data.amount)
      ) {
        const finduser = await user.findOneAndUpdate(
          { address: req.body.user },
          { $push: { ownedcourses: { id: req.body.courseid, status: 0 } } }
        );
        res.status(200).json({ status: 200 });
      }
    }
  } catch (e) {
    res.status(500).json({ status: 500 });
  }
});

app.post("/coursesections", async (req, res) => {
  const findinuser = await user.findOne({
    producedcourses: { $in: [req.body.course] },
    address: req.body.user,
  });

  const findinowned = await user.findOne({
    ownedcourses: { $elemMatch: { id: req.body.course } },
    address: req.body.user,
  });

  console.log(findinowned);
  if (findinuser || findinowned) {
    const getcourse = await course.findById(req.body.course);
    if (getcourse) {
      res.status(200).json(getcourse.sections);
    }
  }
});

app.post("/changestatus", async (req, res) => {
  const addr = req.body.user;
  const usr = await user.findOne({ address: addr });

  const couse = usr.ownedcourses.find(
    (courseObj) => courseObj.id.toString() === req.body.courseid
  );

  if (couse.status < req.body.status) {
    couse.status = req.body.status;
    await usr.save();
  }

  const getcourse = await course.findById(req.body.courseid);

  if (couse.status < getcourse.sections.length) {
    res.status(200).json({ status: 1 });
  } else {
    res.status(200).json({ status: 2 });
  }
});

app.get("/cert/:courseid/:userid", async (req, res) => {
  const findcert = await cert.findOne({
    course: req.params.courseid,
    user: req.params.userid,
  });

  if(findcert){
      res.status(200).json({stat:"found",cert:findcert})
  }else{
    res.status(404).json({stat:"notfound"})
  }
});


app.post("/makecert",async (req,res)=>{

  const filename = Date.now()

  const cou = await course.findById(req.body.courseid)

  const newcert =new cert({user:req.body.user,course:req.body.courseid,file:filename+".pdf"})

  await newcert.save()
  
  makepdf(filename,req.body.user,cou.name)

  res.status(200).json({filename: filename+".pdf"})


})

app.get("/mycert/:pdfid",(req,res)=>{
   res.sendFile(process.cwd()+"/certs/"+req.params.pdfid)
})

app.listen(7000, () => {
  console.log("hello form port 7000");
});
