const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    console.log(req.body.username);
    const newUser = new User({
        username: req.body.username,
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_CRYPTER).toString(), // PASSWORD_CRYPTER variable d'environnenment configurer dans le .env
        
    });

    try {
        const saveUser = await newUser.save();
        res.status(201).send(saveUser)
    } catch (err) {
       res.status(500).send(err)
    }
});

router.post("/login", async (req, res) => {
    //console.log("ffffffffffffffff");
    console.log(req.body.email);
    try {
        const userSearch = await User.findOne({ email: req.body.email }); // on recherche dabord si le user xsite avec l'email
        !userSearch && res.status(401).json("Utilisteur inexistant") // si le user n'existe pas

            const hashPass = CryptoJS.AES.decrypt(userSearch.password, process.env.PASSWORD_CRYPTER);
            const passwword = hashPass.toString(CryptoJS.enc.Utf8);
        passwword !== req.body.password && res.status(401).json("login ou mot de passe incorect") // si le password n'est pas corect

        const accessToken = jwt.sign({
            id: userSearch._id,  //_id de lutilisateur dans la table ou le document
            isAdmin:userSearch.isAdmin
        }, process.env.JWT_SECERT_KEY,
        { expiresIn: "3d" } // 3 jours pour cgarder le cle secret Token
        );

        const { password, ...others } = userSearch._doc// permet de recuperer toutes le information cocernat la table user ou le document user
        res.status(201).send({...others,accessToken}); //permet de recuprer le user en lui affilant un web token
        //res.status(201).send(others); // permet de cuprer le user sans lui affiler un web token
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router  