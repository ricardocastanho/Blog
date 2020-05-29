const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")

//Database
connection
    .authenticate()
    .then(() =>{
        console.log("Conexão feita com o banco de dados")
    })
    .catch((error) => {
        console.log(error)
    })

//
app.set('view engine', 'ejs')
app.use(express.static('public'))
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas
app.get("/", function (req, res) {
    res.render('index')
})

//Servidor
app.listen(8000, function (error) {
    if (error){
        console.log("Ocorreu um erro!")
    }else{
        console.log("Servidor iniciado com sucesso!")
    }
})
