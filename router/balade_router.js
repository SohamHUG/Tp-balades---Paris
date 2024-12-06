import { Router } from "express";
import Balade from '../entite/balade.js';
import { is_auth } from "../middleware/is_auth.js";
import { is_valid_id } from "../middleware/is_valid_id.js";

const router = Router();

// Read
router.get('/', async (req, res) => {
    const balades = await Balade.find()
    res.render("home.ejs", { balades, title: 'Toutes les balades' })
})

router.get('/id/:id', async (req, res) => {
    try {
        const balade = await Balade.findById(req.params.id);
        if (!balade) return res.status(404).render('404.ejs', { erreur: "balade introuvable" });
        res.render('balade.ejs', { balade });
    } catch (err) {
        res.status(400).render('400.ejs', { erreur: "Id incorrect" });
    }
})

router.get('/arrondissement/:num_arrondissement', async (req, res) => {
    const count = await Balade.countDocuments({ arrondissement: req.params.num_arrondissement });
    const balades = await Balade.find({ arrondissement: req.params.num_arrondissement });

    res.render("home.ejs", { balades, title: `Nombre de balades dans l'arrondissement ${req.params.num_arrondissement} : ${count}` })
})

router.get('/synthese', async (req, res) => {
    const synthese = await Balade.aggregate([
        { $group: { _id: '$arrondissement', count: { $sum: 1 } } }
    ]);
    res.render('synthese.ejs', { synthese })
})

router.get('/search', async (req, res) => {
    const searchQuery = req.query.search;
    if (!searchQuery) {
        return res.redirect('/');
    }

    try {
        const balades = await Balade.find({
            texte_intro: {
                $regex: searchQuery,
                $options: 'i',
            },
        });
        if (balades.length > 0) {
            res.render('home.ejs', { balades, title: `Résultats de votre recherche : ${searchQuery}` });
        } else {
            res.render('home.ejs', { balades, title: `Aucun résultat` });
        }

    } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        res.status(500).send('Erreur serveur');
    }
})

// Create
router.get('/add', is_auth, (req, res) => {
    res.render('form_balade.ejs', { erreur: "", balade: {}, title: "Ajouter une balade" })
})

router.post('/add', is_auth, async (req, res) => {
    const data = req.body;


    const balade = Balade({
        nom: data.nom,
        arrondissement: data.arrondissement,
        texte_intro: data.texte_intro,
    });

    try {
        await balade.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).render("form_balade.ejs", { erreur: "le nom ne doit contenir que des minuscules et des majuscules, l'intro doit contenir au minimum 10 lettres", balade });
    }
})

// Update
router.get('/update-one/:id', is_auth, is_valid_id("modification"), async (req, res) => {

    const { id } = req.params;

    const balade = await Balade.findOne({ _id: id })
    res.render('form_balade.ejs', { erreur: "", balade, title: "Modifier une balade" })


})

router.post('/update-one/:id', is_auth, is_valid_id("modification"), async (req, res) => {
    try {
        await Balade.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (error) {
        res.status(400).render("form_balade.ejs", { erreur: error.message, balade: {} });
    }
})

// Delete
router.get('/delete/:id', is_auth, is_valid_id("suppression"), async (req, res) => {
    try {
        await Balade.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(400).render("form_balade.ejs", { erreur: error.message, balade: {} });
    }
})

export default router;
