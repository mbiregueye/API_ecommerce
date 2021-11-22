const User = require("../models/User");
const { route } = require("./auth");
const { verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

/*router.get("/usertest", (req,res) => {
    res.send("user test is succefulll !!!!")
});*/

/*router.post("/userposttest" , (req, res) => {
    console.log(req.body);
    const username = req.body.username
      con st pseudo = req.body.pseudo
       const email = req.body.email
    console.log("les donness postés")
    res.send("votre nom est:" + username)
})*/

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new  // new corespondat au variable passer en parametre
    console.log(req.query.new)
    let users = null
    try {
        if(query) // si la varible new est passer en parametre et egal a true
             users = await User.find().sort({ _id: -1 }).limit(1);
        else
             users = await User.find();

        res.status(200).json(users)
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err)       
    }
});

//GET
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
       const user = await User.findById(req.params.id);
        res.status(201).json(user)
        const { password, ...others } = user._doc// permet de recuperer toutes le information cocernat la table user ou le document user
       
        res.status(201).send(others); //permet de recuprer le user en lui affilant un web token
    } catch (err) {
        res.status(500).json("Erreur lors de la execution de la reqette" + err)       
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAutorization, async (req, res) => {
    if(req.body.password){
        req.body.password =  CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_CRYPTER).toString();
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { //req.params.id  = a l'id passer en parametre dans le update
            $set: req.body  // passer les donnees dans le body
        }, { new: true })   
       res.status(201).json(updateUser)
    } catch (err) {
        res.status(500).json("Erreur lors de la modification: " + err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAutorization, async (req, res) => {
    try {
        await User.findOneAndDelete(req.params.id);
        res.status(201).json("L'utilisateur a ete supprimè")
    } catch (err) {
        res.status(500).json("Erreur lors de la suppression " + err)
        
    }
});

//GET ALL STATS Recuprer le nb utilisteur par mois
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    //res.status(500).json(lastYear);

    try {
        const data = await User.aggregate([ 
            { $match: {createdAt: { $gte:lastYear } } },
            {
                $project:{
                 month: { $month: "$createdAt"} 
                },
            },
            {
                $group: { 
                    _id: "$month",
                    total:{ $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json("Erreur lors de l'execution de la requette" + err)
    }
});

module.exports = router 