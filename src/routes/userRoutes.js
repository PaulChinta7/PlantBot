const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { getDB } = require('../../db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService')
const bcrypt = require('bcrypt');

async function handleRegistration(req, res) {
     try {
    const db = getDB();
    let payload = {
        username: _.get(req,'body.username'),
        email: _.get(req, 'body.email'),
        password:  await bcrypt.hash(_.get(req, 'body.password'), 10),
        createdDateTime: new Date(),
    }
    console.log(payload);
    let resp = await userService.registerUser(payload);
    res.json(resp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleLogin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    console.log("QUE", req.body);
    if (err) return next(err);

    if (!user) {
      return res.status(400).json(info);
    }
    console.log('USER', user);

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2h' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  })(req, res, next);
}

function getProfile(req, res) {
    try {
        let user = req.user;
        res.json(user);

    } catch {
        res.status(500).json({message: "Error while getting profile"});
    }
}
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getProfile
);

router.post('/register',handleRegistration);
router.post('/login', handleLogin);

module.exports = router;