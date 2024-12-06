import { object, string } from "yup"

export async function is_valid_profil(req, rep, next) {
    const schema_profil = object({
        email: string().email().required(`L'adresse email est obligatoire`),
        password: string().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre').required(),
    })
    try {
        await schema_profil.validate(req.body, { abortEarly: false })
        next();
    } catch (err) {
        rep.render("form_user.ejs", { erreur: err.errors, user: req.body, action: "add" })
    }
}
