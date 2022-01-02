var jwt = require("jsonwebtoken");
const express = require('express');
    
const JWT_SECRET = "foruseinlogin";
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.send({ error: "Plaese authenticate using valid token" });
  }
  try {
    const string = jwt.verify(token, JWT_SECRET);
    req.user = string.user;
    next();
  } catch (error) {
    res.send({ error: "Plaese authenticate using valid token" });
  }
};

module.exports = fetchuser;
