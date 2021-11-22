const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { route } = require("./auth");
const { verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE CART
router.post("/add", verifyToken, async (req, res) => {
   const newCart = new Product(req.body);
    try {
        const cart = await newCart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json("Erreur lors de l'execution de la reqette" + err);       
    }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndAutorization, async (req, res) => {
    try {
       const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err);       
    }
});

//UPDATE
 router.put("/:id", verifyTokenAndAutorization, async (req, res) => {   
    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, { //req.params.id  = a l'id passer en parametre dans le update
            $set: req.body  // passer les donnees dans le body
        }, { new: true })   
       res.status(201).json(updateCart)
    } catch (err) {
        res.status(500).json("Erreur lors de la modification: " + err);
    }
}); 

//DELETE
router.delete("/:id", verifyTokenAndAutorization, async (req, res) => {
    try {
        await Cart.findOneAndDelete(req.params.id);
        res.status(201).json("Le Produit a ete supprimè");
    } catch (err) {
        res.status(500).json("Erreur lors de la suppression: " + err);
        
    }
});

//GET ALL 
router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette: " + err);       
    }
});


module.exports = router 