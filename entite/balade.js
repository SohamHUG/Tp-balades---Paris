import { Schema, model } from "mongoose"

const schema_balade = new Schema({
    "nom": {
        type: String,
        maxlength: [255, "le nom contient au maximum 255 lettres"],
        match: [/^[a-zA-Zéèê\ ]+$/, "le nom ne doit contenir que des minuscules et des majuscules"]
    },
    "arrondissement": {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    "texte_intro": {
        type: String,
        required: [true, "le champ est obligatoire"],
        minlength: [10, "le champ contient au minimum 10 lettres"],
    },
    "date_publication": { type: Date, default: Date.now },
})

const Balade = model("balade", schema_balade);

export default Balade; 