import { isValidObjectId } from "mongoose"

export function is_valid_id(texte){
    return function is_valid_id(req, rep, next){
        const { id } = req.params ;
        if(!isValidObjectId(id)){
            rep.status(400).render("400.ejs", {erreur : `${texte} impossible : id invalid ${ id }`})
            return 
        }
        next();
    }
}