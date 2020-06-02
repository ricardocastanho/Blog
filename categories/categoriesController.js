const express = require("express")
const router = express.Router()
const Category = require("./category")
const slugify = require("slugify")
// importando o body-parser aqui ......
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//Rotas
router.get("/admin/categories/", function (req, res) {
    Category.findAll().then(categories => {
        res.render('categories/index', {categories: categories})
    })
})

router.get("/admin/categories/create", function (req, res) {
    res.render('categories/create')
})

router.get("/admin/categories/edit/:id", function (req, res) {
    var id = req.params.id
    if(isNaN(id)){
        res.redirect("/admin/categories/")
    }
    Category.findByPk(id).then(categories => {
        if(categories != undefined){
            res.render('categories/edit', {categories: categories})
        }else{
            res.redirect("/admin/categories/")
        }
    }).catch(error => {
        res.redirect("/admin/categories/")
    })
})

router.post("/admin/categories/save", function (req, res) {
    var title = req.body.title
    if(title != undefined && title != null){
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(() => {
            res.redirect("/admin/categories/create")
        })
    }else{
        res.redirect("/admin/categories/create")
    }
})

router.post("/admin/categories/update", function (req, res) {
    var id = req.body.id
    var title = req.body.title
    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

router.post("/admin/categories/delete", function (req, res) {
    var id = req.body.id
    if(id != undefined && id != null){
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/categories/")
        })
    }else{
        res.redirect("/admin/categories/")
    }
})

module.exports = router;
