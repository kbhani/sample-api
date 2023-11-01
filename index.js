const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const secretkey = "secrrretkey";
const user = {
  id: 1,
  username: "Anil",
  email: "abc@test.com",
};

app.get("/", (req, resp) => {
  resp.json({
    message: "a sample api",
  });
});

app.post("/login", (req, resp) => {
  jwt.sign({ user }, secretkey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});

//after the route, humne wohi verify wala function use kiya hai jo actually verify karega
app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretkey, (err, authData) => {
    if (err) {
      resp.send({ result: "invalid token" });
    } else {
      resp.json({
        message: "profile accessed",
        authData,
      });
    }
  });
});

// ye function karega verify token ko har jagah
function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    console.log("token process 1");
    next();
  } else {
    resp.send({
      result: "Token is invalid",
    });
  }
}
app.listen(5000, () => {
  console.log("app running on port 5000");
});
