const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')
const {validationResult} = require("express-validator");

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd")   
    },
    create: function (req, res) {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            db.Movie.create(
                {
                    title : req.body.title,
                    rating : +req.body.rating,
                    length : +req.body.length,
                    awards : +req.body.awards,
                    release_date : req.body.release_date
                }
            ).then(result =>{
                console.log(result);
                res.redirect("/movies");
            })
        }else{
            res.render("moviesAdd",{
                errors : errors.mapped(),
                old : req.body
            })
        }
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie =>{
                res.render("moviesEdit",{
                    Movie,
                    date : moment(Movie.release_date).format('YYYY-MM-DD')
                })
            })
    },
    update: function (req,res) {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.Movie.update(
                {
                    title : req.body.title,
                    rating : req.body.rating,
                    awards : req.body.awards,
                    release_date : req.body.release_date,
                    length : req.body.length
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            ).then(Movie =>{
                res.redirect("/movies")
            })
        }else{
            db.Movie.findByPk(req.params.id)
                .then(Movie =>{
                    res.render("moviesEdit",{
                        errors : errors.mapped(),
                        old : req.body,
                        Movie ,
                        date : Movie.release_date.toLocaleDateString()
                    })
                })
        }
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie =>{
                res.render("moviesDelete",{
                    Movie
                })
            })
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where : {
                id : req.params.id
            }
        }).then(result =>{
            res.redirect("/movies")
        })
    }

}

module.exports = moviesController;