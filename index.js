const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")
const article = require("./articles/articles")
const categories = require("./categories/category")
const Article = require("./articles/articles")
const Category = require("./categories/category")

//Database
connection
    .authenticate()
    .then(() =>{
        console.log("Conexão feita com o banco de dados")
    })
    .catch((error) => {
        console.log(error)
    })

//utilizando as rotas dos controladores
app.use("/", categoriesController)
app.use("/", articlesController)

//ejs e ajeitando o public
app.set('view engine', 'ejs')
app.use(express.static('public'))
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rota para homepage
app.get("/", function(req, res) {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })
})
app.get("/:slug", function(req, res) {
    slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {
        if(articles != undefined){
            Category.findAll().then(categories => {
                res.render('article', {articles: articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( err => {
            res.redirect("/")
    })
})
app.get("/category/:slug", function(req, res) {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll()
            .then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

//Servidor
app.listen(2000, function (error) {
    if (error){
        console.log("Ocorreu um erro!")
    }else{
        date = new Date()
        console.log("Servidor iniciado com sucesso! Horário: " 
        + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
    }
})
