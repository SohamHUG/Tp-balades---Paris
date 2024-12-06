import User from "../entite/user.js";


export async function email_uniq(req, rep, next) {
    const { email } = req.body;

    const reponse = await User.findOne({ email: email })
    if (reponse) {
        rep.status(400).render("form_user.ejs", { erreur: `l'email ${email} est déjà utilisé`, user: req.body, action: 'add' })
        return;
    }
    next();
}
