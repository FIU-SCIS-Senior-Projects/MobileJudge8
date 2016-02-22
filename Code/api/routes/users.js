var epilogue = require('epilogue'),
	notFound = require('restify').errors.NotFoundError,
	crypt = require('../utils/crypt.js'),
	_ = require('lodash');

module.exports = function(server, db) {
	server.get(apiPrefix + '/profile', function (req, res, next) {
		db.user.findById(req.user.id).then(function (user) {
			if (user == null) return next(new notFound());
			res.send(_.omit(user.toJSON(), ['oauth', 'password', 'grade']));
			next();
		});
	});
	
	server.put(apiPrefix + '/profile', function (req, res, next) {
		db.user.findById(req.user.id).then(function (user) {
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
