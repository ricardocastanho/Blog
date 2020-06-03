function auth(req, res, next){
    if(req.body.user == undefined){
        res.redirect("/admin/users/login")
    }else{
        next()
    }
}

module.exports = auth