'use strict';

const token = require('../token');
const mongo = require('../db');
const _ = require('underscore');

exports.register = function (server, options, next) {

  console.log('Token Const: ', token);
    server.route({
        method: 'GET',
        path: '/me',

        handler: function (request, reply) {
            console.log('------------ GET "/Me" Called -----------');
            token.validateToken(request.headers.authorization, function(err, authToken){
              if(err){
                console.log('invalid token');
                reply('Invalid Token').code(err);
                return;
              }
              mongo(function(db){
                let people = db.collection('people');
                people.findOne({authToken: authToken}, function(err, data){
                  if(err || !data){
                    console.log('unable to find user')
                    reply('Invalid Request').code(400);
                  }
                  console.log('got user successfully');
                  var replyObject = _.clone(data);
                  delete replyObject._id;
                  delete replyObject.keyId;
                  delete replyObject.authToken;
                  delete replyObject.expiryDate;
                  reply(replyObject);
                })
              })
              // reply();
            });

        }
    });


    next();
};


exports.register.attributes = {
    name: 'me'
};
