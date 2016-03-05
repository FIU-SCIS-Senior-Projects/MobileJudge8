var epilogue = require('epilogue'),
	notFound = require('restify').errors.NotFoundError,
	crypt = require('../utils/crypt.js'),
	_ = require('lodash');

module.exports = function(server, db) {
	server.get(apiPrefix + '/profile', function (req, res, next) {
		var model;
		switch(req.user.role) {
			case 1:
				model = db.student;
				break;

			case 2:
				model = db.judge;
				break;

			case 3:
				model = db.user;
				break;
		}
		model.findById(req.user.id).then(function (user) {
			if (user == null) return next(new notFound());
			res.send(_.omit(user.toJSON(), ['password', 'grade']));
			next();
		});
	});

	server.put(apiPrefix + '/profile', function (req, res, next) {
		db.user.findById(req.user.id).then(function (user) {
			var oauth = false;
			for(var key in req.params){
				if(key==='oauth'){
					oauth = true;
				}
			}

			if(oauth){
				var parsedData = req.params;
				var newToken = undefined;
				for(var key in parsedData){
					if(key==='oauth')
						continue;
					if(newToken===undefined){
						newToken = {};
					}
					var value = parsedData[key];
					newToken[key] = {};
					newToken[key] = value;
				}
				user.oauth = JSON.stringify(newToken);
				user.save();
				res.json({
                                        	result: true
                                        });
			}
			if(!oauth){
				if (user == null)
					return next(new notFound());
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				user.email = req.body.email;
				user.profileImgUrl = req.body.profileImg;
				if(req.body.password) {
					crypt.hashPassword(req.body.password)
						.then(function(hash) {
							user.password = hash;
							user.save();
							res.json({
								result: true
							});
						});
				} else {
					user.save();
					res.json({
						result: true
					});
				}
			}
		});
		next();
	});

	return {
		crud: epilogue.resource({
			model: db.user,
			excludeAttributes: ['createdAt','updatedAt','password','oauth'],
			actions: ['create', 'read', 'update', 'delete'],
			endpoints: [apiPrefix + '/users', apiPrefix + '/users/:id']
		})
	};
};
