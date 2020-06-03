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

router.get("/admin/articles/edit/:id", function (req, res) {
    var id = req.params.id
    if(isNaN(id)){
        res.redirect("/admin/articles/")
    }
    Article.findByPk(id).then(articles => {
        if(articles != undefined){
            Category.findAll().then(categories => {
                res.render('articles/edit', {articles: articles, categories: categories})
            })
        }else{
            res.redirect("/admin/articles/")
        }
    }).catch(error => {
        res.redirect("/admin/articles/")
    })
})

//Paginação
router.get("/admin/articles/page/:num"), (req, res) => {
    var page = req.params.num
    var offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = parseInt(page) * 4
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset
    }).then(articles => {
        var next
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        var result = {
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render("articles/page", {result: result, categories: categories})
        })
    })
}

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

router.post("/admin/articles/update", function (req, res) {
    var id = req.body.id
    var title = req.body.title
    var categoryId = req.body.categoryId
    var body = req.body.body
    Article.update({
        title: title,
        slug: slugify(title),
        categoryId: categoryId,
        body: body
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    })
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
