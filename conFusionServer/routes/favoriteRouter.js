const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (fav) => {
          if (fav) {
            user_favorites = fav.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            if (!user_favorites) {
              var err = new Error("You have no favorites!");
              err.status = 404;
              return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user_favorites);
          } else {
            var err = new Error("There are no favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then((fav) => {
        var user;
        if (fav)
          user = fav.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favorites({ user: req.user.id });
        for (let i of req.body) {
          if (
            user.dishes.find((d_id) => {
              if (d_id._id) {
                return d_id._id.toString() === i._id.toString();
              }
            })
          )
            continue;
          user.dishes.push(i._id);
        }
        user
          .save()
          .then(
            (userFav) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFav);
              console.log("Favourites Created");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (fav) => {
          var favToRemove;
          if (fav) {
            favToRemove = fav.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
          }
          if (favToRemove) {
            favToRemove.remove().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error("You do not have any favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (fav) => {
          if (fav) {
            const fav = fav.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            const dish = fav.dishes.filter(
              (dish) => dish.id === req.params.dishId
            )[0];
            if (dish) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            } else {
              var err = new Error("You do not have dish " + req.params.dishId);
              err.status = 404;
              return next(err);
            }
          } else {
            var err = new Error("You do not have any favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then((fav) => {
        var user;
        if (fav)
          user = fav.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favorites({ user: req.user.id });
        if (
          !user.dishes.find((d_id) => {
            if (d_id._id)
              return d_id._id.toString() === req.params.dishId.toString();
          })
        )
          user.dishes.push(req.params.dishId);

        user
          .save()
          .then(
            (userFav) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFav);
              console.log("Favourites Created");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorites/:dishId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          var user;
          if (favorites)
            user = favorites.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
          if (user) {
            user.dishes = user.dishes.filter(
              (dishId) => dishId._id.toString() !== req.params.dishId
            );
            user.save().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error("You do not have any favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
