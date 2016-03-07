'use strict';

const token = require('../token');

exports.register = function (server, options, next) {

  console.log('Token Const: ', token);
    server.route({
        method: 'GET',
        path: '/',

        handler: function (request, reply) {
            token.validateToken(request.query.authToken, function(err, authToken){
              if(err){
                reply('Invalid Token').code(err);
                return;
              }

              reply('Authed Successfully!');
            });

        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
