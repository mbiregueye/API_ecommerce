const jwt = require("jsonwebtoken");

//fonction de verifier d'un token valide
const verifyToken = (req, res, next) => { 
    const authHeader = req.headers.token
    if(authHeader){ // si la requete n'est pa accompagner de token dans le Header
        const token = authHeader//.split(" ")[1];
        //console.log(token+" khaaaaaaaaaaaaaaaa")
        jwt.verify(token, process.env.JWT_SECERT_KEY, (err, user) => {
            if(err)
                res.status(403).json("Le Token n'est pas valide");
                req.user = user;
                next();
        })
    }else{
        return res.status(401).json("Desolez, vous n'ets pas authentifié")
    }
}

const verifyTokenAndAutorization = (req, res, next) => { 
    verifyToken(req, res, () => {  // apppel de la fonction verifyToken
        if(req.user.id === req.params.id || req.user.isAdmin){ //verifier si l'ulisteur a le a la token ou que son profill isAmin = true
            next()
        }else{
            res.status(403).json("Vous n'etes pas autoriser à faire cette action");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => { 
    verifyToken(req, res, () => {  // apppel de la fonction verifyToken
        //console.log(req.user.isAdmin +"ddddd")
        if(req.user.isAdmin){ //verifier si l'ulisteur a le a la token ou que son profill isAmin = true          
            next()
        }else{
            res.status(403).json("Vous n'etes pas autoriser à faire cette action");
        }
    });
};

module.exports = { verifyToken,verifyTokenAndAutorization,verifyTokenAndAdmin }  //ici on export les fonctions