import { Router } from "express";
import User from '../entite/user.js';
import bcrypt from 'bcryptjs'
import { email_uniq } from "../middleware/email_uniq.js";
import { is_valid_profil } from "../middleware/verif_profil.js";


const router = Router();

// Register
router.get('/register', (req, res) => {
    res.render('form_user.ejs', { erreur: "", action: "add", user: {} })
})

router.post('/register', is_valid_profil, email_uniq, async (req, res) => {
    const data = req.body;

    const { password } = req.body;

    if (password.length == 0) {
        res.status(400).render("form_user.ejs", { erreur: "mot de passe obligatoire", action: "add", user: data });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hashe = await bcrypt.hash(password, salt)

    const user = User({
        email: data.email,
        password: password_hashe,
    })

    try {
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).render("form_user.ejs", { erreur: error.message, action: 'add', user });
    }
})

// Login
router.get('/login', (req, res) => {
    res.render('form_user.ejs', { erreur: "", action: "", user: {} })
})

router.post('/login', async (req, res) => {
    const data = req.body;

    try {
        const user = await User.findOne({ email: data.email })
        if (!user) {
            res.status(400).render("form_user.ejs", { erreur: "Email ou mot de passe incorrect", action: "", user: data });
        }

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) {
            res.status(400).render("form_user.ejs", { erreur: "Email ou mot de passe incorrect", action: "", user: data });
        }

        req.session.user = { id: user._id, email: user.email };
        res.redirect('/');
    } catch (error) {
        res.status(400).render("form_user.ejs", { erreur: "Email ou mot de passe incorrect", action: "", user: data });
    }

})

// Logout 
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/')
    });
});

export default router;
