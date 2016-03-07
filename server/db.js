
var url         = 'mongodb://houseBot:0814@ds023478.mlab.com:23478/apt508';
var MongoClient = require('mongodb').MongoClient;
var db          = null;

module.exports = function(cb){
  if(db){
    cb(db);
    return;
  }

  MongoClient.connect(url, function(err, conn) {
    if(err){
      console.log(err.message);
      throw new Error(err);
    } else {
      db = conn;
      cb(db);
    }
  });
}
