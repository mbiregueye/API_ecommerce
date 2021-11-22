const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const userRoute = require("./routes/userController") // importer le route User
const authRoute = require("./routes/auth") // importer le route auth qui est un controller
const productRoute = require("./routes/productController") // importer le route Product qui est un controller
const orderRoute = require("./routes/orderController") // importer le route Order qui est un controller
const cartRoute = require("./routes/cartController") // importer le route Product qui est un controller


 
dotenv.config();

mongoose.connect(
    /*"mongodb+srv://root:passer123@cluster0.1psji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"*/
    process.env.MONGO_ULR // MONGO_ULR la variable d'environnement dans .env qui nous permet de nous connecter MongoDB
    ).then(() => console.log("Db Connection reussi a la base de donnes")
    ).catch((err) => console.log("Erreur de Conection à la base de donnees: " + err))

/****Parser es donnees avec Body Parser**/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
/*******************************************/


app.get("/api/test", () => {
    console.log("port entrer de l'application") 
})
//app.use(express.json); 

app.use("/api/auth", authRoute); 
app.use("/api/user", userRoute); 
app.use("/api/product", productRoute); 
app.use("/api/order", orderRoute); 
app.use("/api/cart", cartRoute); 


 
app.listen(process.env.PORT || 5000, () => { 
    console.log('serveur demarer dans le port 5000')
})

