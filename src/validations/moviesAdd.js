const db = require("../database/models");
const {body} = require("express-validator");


module.exports = [

    body("title")
        .notEmpty().withMessage("debes introducir un titulo"),
        // .custom((value,{req}) =>{
        //     db.Movie.findOne(
        //         {
        //             where : {
        //                 title : "pepe"
        //             }
        //         }
        //     ).then(movie =>{
        //         if (movie) {
        //            return false
        //         }else{
        //             return true
        //         }
        //     })
        //     return true
        // }).withMessage("la pelicula ya existe"),

    body("rating")
        .notEmpty().withMessage("debes introducir un rating")
        .isString().withMessage("el rating tiene que ser numerico")
        .custom((value,{req}) => {
           if(value > 10) {
                throw new Error("el rating no puede ser mayor a 10")   
           }else{
               return true
           }
        }),

    body("awards")
        .isString().withMessage("la cantidad de premios tiene que ser numerica"),

    body("release_date")
        .notEmpty().withMessage("la pelicula tiene que tener una fecha"),

    body("length")
       .notEmpty().withMessage("tienes que introducir la duracion de la pelicula")
       .isString().withMessage("la duracion de la pelicula tiene que ser numerica"),
]