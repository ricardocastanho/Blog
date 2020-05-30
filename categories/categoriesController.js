const express = require("express")
const router = express.Router()

//Rotas
router.get("/", function (req, res) {
    res.render('index')
})

module.exports = router;
