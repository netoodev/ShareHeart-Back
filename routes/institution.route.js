const express = require('express');
const app = express();
const institutionRoutes = express.Router();

let Institution = require('../model/Institution');

// api to add institution
institutionRoutes.route('/add').post(function (req, res) {
    let institution = new Institution(req.body);
    institution.save()
        .then(institution => {
            res.status(200).json({ 'status': 'success', 'mssg': 'institution added successfully' });
        })
        .catch(err => {
            res.status(409).send({ 'status': 'failure', 'mssg': 'unable to save to database' });
        });
});

// api to get institutions
institutionRoutes.route('/').get(function (req, res) {
    Institution.find(function (err, institutions) {
        if (err) {
            res.status(400).send({ 'status': 'failure', 'mssg': 'Something went wrong' });
        }
        else {
            res.status(200).json({ 'status': 'success', 'institutions': institutions });
        }
    });
});

// api to get institution
institutionRoutes.route('/institution/:id').get(function (req, res) {
    let id = req.params.id;
    Institution.findById(id, function (err, institution) {
        if (err) {
            res.status(400).send({ 'status': 'failure', 'mssg': 'Something went wrong' });
        }
        else {
            res.status(200).json({ 'status': 'success', 'institution': institution });
        }
    });
});

// api to update route
institutionRoutes.route('/update/:id').put(function (req, res) {
    Institution.findById(req.params.id, function (err, institution) {
        if (!institution) {
            res.status(400).send({ 'status': 'failure', 'mssg': 'Unable to find data' });
        } else {
            institution.name = req.body.name;
            institution.cnpj = req.body.cnpj;
            institution.area = req.body.area;

            institution.save().then(business => {
                res.status(200).json({ 'status': 'success', 'mssg': 'Update complete' });
            })
        }
    });
});

// api for delete
institutionRoutes.route('/delete/:id').delete(function (req, res) {
    Institution.findByIdAndRemove({ _id: req.params.id }, function (err,) {
        if (err) {
            res.status(400).send({ 'status': 'failure', 'mssg': 'Something went wrong' });
        }
        else {
            res.status(200).json({ 'status': 'success', 'mssg': 'Delete successfully' });
        }
    });
});

module.exports = institutionRoutes;