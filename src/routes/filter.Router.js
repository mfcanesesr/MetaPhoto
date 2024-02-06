const express = require("express");

const FilterController = require("../controller/filter.controller");

const FilterRouter = express.Router();

//Enviar datos de los alumnos
FilterRouter.get("/", FilterController.getFilter);
FilterRouter.get("/photos/:photoId", FilterController.getPhotos);

module.exports = FilterRouter;