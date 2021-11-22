const Order = require("../models/Order");
const { route } = require("./auth");
const { verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE CART
router.post("/add", verifyToken, async (req, res) => {
   const newOrder = new Order(req.body)
    try {
        const order = await newOrder.save();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json("Erreur lors de l'execution de la requette" + err)       
    }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAutorization, async (req, res) => {
    try {
       const orders = await Order.find({ userId: req.params.userId });
        res.status(201).json(orders);
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la requette" + err); 
    }
});

//UPDATE
 router.put("/:id", verifyTokenAndAdmin, async (req, res) => {   
    try {
        const updateOder = await Order.findByIdAndUpdate(req.params.id, { //req.params.id  = a l'id passer en parametre dans le update
            $set: req.body  // passer les donnees dans le body
        }, { new: true })   
       res.status(201).json(updateOder);
    } catch (err) {
        res.status(500).json("Erreur lors de la modification: " + err);
    }
}); 

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findOneAndDelete(req.params.id);
            res.status(201).json("Le Produit a ete supprimè");
    } catch (err) {
            res.status(500).json("Erreur lors de la suppression " + err);  
    }
});

//GET ALL 
router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err);     
    }
});

//GET MONTHLY INCOME
router.get("/income" , verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
   try {
       const income = await Order.aggregate([
           { $match: { createdAt: {$gte: previousMonth } }},
               {
                   $project:{
                       month: { $month: "$createdAt" },
                       sales: "$amount",
                   },
               },
               {
                   $group:{
                      _id: "$month" ,
                      total:{ $sum: "$sales" },
                   },
               },
       ]);
       res.status(200).json(income);
   } catch (err) {
       res.status(500).json("Erreur lors de la execution de la reqette: " + err);
   }

});

module.exports = router 