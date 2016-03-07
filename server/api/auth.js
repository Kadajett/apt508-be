'use strict';

const yub = require('yub');
const assert = require('assert');
let mongo = require('../db');
let token = require('../token');
const _ = require('underscore');
const crypto = require('crypto');
yub.init("27584", "SntmpMo6YKhFvD7jgdUXTnbiTVw=");

// 27584
// 	SntmpMo6YKhFvD7jgdUXTnbiTVw=

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/auth',
        handler: function (request, reply) {

            reply({ message: 'Welcome to the auth route' });
        }
    });

    server.route({
      method: 'POST',
      path: '/auth',
      handler: function(request, reply){
        yub.verify(request.payload.otp, function(err,data) {
          console.log('------------- login called -------------');
          if(err || data.valid == false) {
            reply("Login Failed").code(401);
            console.error("Login Failed: " + JSON.stringify(data));
            return;
          }
          console.log('yubVerified');
          mongo(function(db){
            var people = db.collection('people');

            people.findOne({keyId: data.identity}, function(err, result){
              if(err || !result){
                reply('Unable to find user with those credentials.').code(401);
                // db.close();
                return;
              }
              console.log('Found user: ' + result.name);
              token.generate(function(tokenResult){
                // authToken;
                people.updateOne({keyId: data.identity}, {$set: {authToken: tokenResult.token, expiryDate: tokenResult.expiryDate}}, {}, function(err, data){
                  if(err){
                    reply('Error generating auth token.').code(500);
                    db.close();
                    return;
                  }
                  reply({
                    authToken: tokenResult.token,
                    expiryDate: tokenResult.expiryDate
                  });
                  // db.close();
                })
              });
            })

          })

        });
      }
    });


    next();
};


exports.register.attributes = {
    name: 'auth'
};
