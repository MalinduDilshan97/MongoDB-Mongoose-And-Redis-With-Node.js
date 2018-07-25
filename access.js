let {mongoose} = require("./db/mongooseConfig");
let {Customer} = require('./models/customer');

module.exports.saveBook = function(nameOF, addressOF, callback) {

    var newCustomer = new Customer ({
            name:nameOF,
            address:addressOF
    });

    newCustomer.save(callback);
	
};

module.exports.findCustomerByNameCached = function(redis, name, callback) {
	redis.get(name, function(err, reply) {
		if (err)
			callback(null);
		else if (reply) //Customer exists in cache
            callback(JSON.parse(reply));
		else {
			//Customer doesn't exist in cache take it from Db
			Customer.find({name:name}, function(err, doc) {
				if (err || !doc)
					callback(null);
				else {
					//Customer found in database, save to cache and return to client
					redis.set(id, JSON.stringify(doc), function() {
                        callback(doc);
                    });
				}
			});
		}
	});
};

module.exports.updateCustomer = function(redis, id , name, address, callback) {
    Customer.findOneAndUpdate({_id:id},{name:name,address:address},function (err, doc){

        if(err)
			callback(err);
		else if (!doc)
			callback('Missing Customer');
		else {
			//Save Updated Customer to cache
			redis.set(id, JSON.stringify(doc), function(err) {
				if(err)
					callback(err);
				else
					callback(null);
			});
        }

    });
};
