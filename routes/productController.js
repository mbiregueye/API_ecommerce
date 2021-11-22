const Product = require("../models/Product");
const { route } = require("./auth");
const { verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE PRODUCT
router.post("/add", verifyTokenAndAdmin, async (req, res) => {
   const newProduct = new Product(req.body)
    try {
        const product = await newProduct.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json("Erreur lors de l'execution de la reqette" + err)       
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
       const product = await Product.findById(req.params.id);
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err)       
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {   
    try {
        const updateProduct = await User.findByIdAndUpdate(req.params.id, { //req.params.id  = a l'id passer en parametre dans le update
            $set: req.body  // passer les donnees dans le body
        }, { new: true })   
       res.status(201).json(updateProduct)
    } catch (err) {
        res.status(500).json("Erreur lors de la modification: " + err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findOneAndDelete(req.params.id);
        res.status(201).json("Le Produit a ete supprimè")
    } catch (err) {
        res.status(500).json("Erreur lors de la suppression " + err)
        
    }
});

//GET ALL PRODUCT
router.get("/products", async (req, res) => {
    const queryProd = req.query.new  // new correspond au variable passer en parametre
    const queryCategory = req.query.category  // category correspond au variable passer en parametre
    
    // console.log(req.query.new)
    let products;
    try {

        if(queryProd) // si la varible new est passer en parametre et egal a true
            products = await Product.find().sort({ createdAt: -1 }).limit(2);
        else 
            if(queryCategory)  // filtere par categorie passer en parametre
                products = await Product.find({ categories:{
                    $in:[queryCategory]
                }});
            else  // sinon  recuprer tous les produits
            products = await Product.find(); 

        res.status(200).json(products)
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err)       
    }
});

module.exports = router 