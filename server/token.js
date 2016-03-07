'use strict';

const crypto = require('crypto');
const base64url = require('base64url');
const moment = require('moment');
const db = require('./db');

function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

function pastExpiryTime(time){
  return moment().isAfter(time);
}

function validateToken(token, cb){
  console.log('Validate Token Called');
  if(!token){
    console.log('Token Unavailable');
    cb(401, null);
    return;
  }

  console.log('Validating Token: ' + token);

  db(function(mongo){
    var people = mongo.collection('people');
    people.findOne({authToken: token}, function(err, result){
      if(err || !result || pastExpiryTime(result.expiryDate)){
        console.log('Invalid Auth Token');
        cb(401, null);
        return;
      }

      console.log('Valid Auth Token');
      cb(null, token);
    });
  })
}

module.exports = {
  generate: function(cb){
    cb({
      token: randomStringAsBase64Url(20),
      expiryDate: moment().add(24, 'hours').format()
    });
  },
  validateToken: validateToken
}
