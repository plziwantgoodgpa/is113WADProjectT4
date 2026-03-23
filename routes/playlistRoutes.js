const express = require("express");

const router = express.Router();

router.get("/",(req,res)=>{
    const user_id = //find user id func
    res.render("playlist", {user_id})
} );


module.exports = router;