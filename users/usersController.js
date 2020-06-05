const express = require("express")
const router = express.Router()
const User = require('./user')
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
// importando o body-parser aqui ......
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.get("/admin/users/login", function(req, res) {
    res.render("users/login")
})

router.get("/admin/users/logout", auth, function(req, res) {
    req.session.user = undefined
    res.redirect("/admin/users/login")
})

router.get("/admin/users/create", auth, function(req, res) {
    res.render("users/create")    
})

router.post("/admin/users/create", function(req, res) {
    var email = req.body.email
    var password = req.body.password

    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    User.create({
        email: email,
        password: hash
    }).then(() =>{
        res.redirect("/")
    }).catch((err) => {
        res.redirect("/")
    })
})

router.post("/admin/users/auth", function(req, res) {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user != undefined){
            var validation = bcrypt.compareSync(password, user.password)
            if(validation){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/")
            }
        }else{
            res.redirect("/admin/users/login")
        }
    })
})

module.exports = router;