const express = require('express');
const app = express();
const donorRoutes = express.Router();

let Donor = require('../model/Donor');

// api to add donor
donorRoutes.route('/add').post(function (req, res) {
  let donor = new Donor(req.body);
  donor.save()
  .then(donor => {
    res.status(200).json({'status': 'success','mssg': 'donor added successfully'});
  })
  .catch(err => {
    res.status(409).send({'status': 'failure','mssg': 'unable to save to database'});
  });
});

// api to get donors
donorRoutes.route('/').get(function (req, res) {
  Donor.find(function (err, donors){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','donors': donors});
    }
  });
});

// api to get donor
donorRoutes.route('/donor/:id').get(function (req, res) {
  let id = req.params.id;
  Donor.findById(id, function (err, donor){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','donor': donor});
    }
  });
});

// api to update route
donorRoutes.route('/update/:id').put(function (req, res) {
    Donor.findById(req.params.id, function(err, donor) {
    if (!donor){
      res.status(400).send({'status': 'failure','mssg': 'Unable to find data'});
    } else {
        donor.name = req.body.name;
        donor.email = req.body.email;
        donor.phone_number = req.body.phone_number;
        donor.password = req.body.password;
        donor.cpf = req.body.cpf;
        donor.picture = req.body.picture;
        donor.birth_date = req.body.birth_date;

        donor.save().then(business => {
          res.status(200).json({'status': 'success','mssg': 'Update complete'});
      })
    }
  });
});

// api for delete
donorRoutes.route('/delete/:id').delete(function (req, res) {
  Donor.findByIdAndRemove({_id: req.params.id}, function(err,){
    if(err){
      res.status(400).send({'status': 'failure','mssg': 'Something went wrong'});
    }
    else {
      res.status(200).json({'status': 'success','mssg': 'Delete successfully'});
    }
  });
});

module.exports = donorRoutes;