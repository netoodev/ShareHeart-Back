const express = require('express');
const app = express();
const donorRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let Donor = require('../model/Donor');

// api to add donor
donorRoutes.post('/add', async(req, res) => {

  const {name, email, password, phone_number, cpf, picture, birth_date} = req.body

  // Validações
  if(!name) {
      return res.status(422).json({msg: 'O nome é obrigatorio!'})
  } 
  if(!email) {
      return res.status(422).json({msg: 'O email é obrigatorio!'})
  }
  if(!password) {
      return res.status(422).json({msg: 'A senha é obrigatorio!'})
  }
  if(!cpf) {
      return res.status(422).json({msg: 'O CPF é obrigatorio!'})
  }

  // verifica se o email já foi criado
  const bucarDonor = await Donor.findOne({ email: email})
  if(bucarDonor) {
       return res.status(422).json({msg: 'Email já cadastrado!'})
  }

  // criptografando a senha para salvar no banco de dado
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  let donor = new Donor({name, email, password: passwordHash, cpf})

  try {
      await donor.save()
      res.status(201).json({msg: 'Usuário criado com sucesso!'})
  } catch (error) {
      console.log(error)
      res.status(500).json({msg: 'erro no cod'})
  }
})

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

// api to login donor
donorRoutes.post('/login', async (req, res) => {

  const {email, password} = req.body

  if(!email) {
      return res.status(422).json({msg: 'O email é obrigatorio!'})
  }
  if(!password) {
      return res.status(422).json({msg: 'A senha é obrigatorio!'})
  }

  const user = await Donor.findOne({ email: email})
  if(!user) {
      return res.status(404).json({msg: 'Usuário não encontrado.'})
  }

  const checarSenha = await bcrypt.compare(password, user.password)
  if(!checarSenha) {
      return res.status(422).json({msg: 'Senha inválida.'})
  }

  try {
      
      const secret = process.env.SECRET

      const token = jwt.sign(
        {
          id: user._id
        }, 
        secret,
      )

      res.status(200).json({msg: 'Autenticação realizada com sucesso.', token})

  } catch (error) {
      
      console.log(error)
      res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})

  }

})


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
donorRoutes.route('/update/:id').put(async function (req, res) {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(400).json({ 'status': 'failure', 'mssg': 'Unable to find data' });
    }

    // Verificar quais campos estão presentes no corpo da solicitação antes de atualizá-los
    if (req.body.name) donor.name = req.body.name;
    if (req.body.email) donor.email = req.body.email;
    if (req.body.phone_number) donor.phone_number = req.body.phone_number;
    if (req.body.password) donor.password = req.body.password;
    if (req.body.cpf) donor.cpf = req.body.cpf;
    if (req.body.picture) donor.picture = req.body.picture;
    if (req.body.birth_date) donor.birth_date = req.body.birth_date;

    await donor.save();
    return res.status(200).json({ 'status': 'success', 'mssg': 'Update complete' });
  } catch (err) {
    console.error('Erro ao atualizar o doador:', err);
    return res.status(500).json({ 'status': 'failure', 'mssg': 'Internal server error', 'error': err.message });
  }
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