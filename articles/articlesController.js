const express = require("express")
const router = express.Router()
const Category = require("../categories/category")
const Article = require("./articles")
const slugify = require("slugify")
// importando o body-parser aqui ......
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//Rotas
router.get("/admin/articles", function (req, res) {
    Article.findAll({
        include: [{model:Category}]
    }).then(articles => {
        res.render('articles/index', {articles: articles})
    })
})

router.get("/admin/articles/create", function(req, res) {
    Category.findAll().then(categories => {
        res.render('articles/create', {categories: categories})
    })
})

router.post("/admin/articles/save", function (req, res) {
    var title = req.body.title
    var body = req.body.body
    var categoryId = req.body.categoryId
    if(title != undefined && title != null){
        Article.create({
            title: title,
            body: body,
            slug: slugify(title),
            categoryId: categoryId
        }).then(() => {
            res.redirect("/admin/articles")
        })
    }else{
        res.redirect("/admin/articles/create")
    }
})
router.post("/admin/articles/delete", function (req, res) {
    var id = req.body.id
    if(id != undefined && id != null){
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/articles/")
        })
    }else{
        res.redirect("/admin/articles/")
    }
})
module.exports = router;
