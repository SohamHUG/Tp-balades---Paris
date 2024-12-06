import express from "express"
import { connect } from "mongoose"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import baladesRouter from './router/balade_router.js'
import usersRouter from './router/user_router.js'
import session from "express-session"

connect("mongodb+srv://admin:2LpZmwlt17m0j5rX@cluster0.kqwvj.mongodb.net/Paris")
    .then(() => {
        console.log("connexion à mongodb atlas réussie")
    })
    .catch((err) => {
        console.log(new Error(err))
    })


const app = express();
const PORT = 1234;

app.set('view engine', 'ejs')
app.set('views', './views')
const path_dossier = dirname(fileURLToPath(import.meta.url))
app.use(express.static(join(path_dossier, "public")))

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'key_secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
    }
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.user ? true : false;
    next();
});

app.use(baladesRouter);
app.use(usersRouter);


app.listen(PORT, console.log(`express écoute sur le port ${PORT}`))