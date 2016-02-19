var epilogue = require('epilogue'),
	notFound = require('restify').errors.NotFoundError,
	crypt = require('../utils/crypt.js'),
	_ = require('lodash');

module.exports = function(server, db) {
	server.get(apiPrefix + '/profile', function (req, res, next) {
		var model/* = req.user.role == 1 ? db.student : db.judge*/;
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
			res.send(_.omit(user.toJSON(), ['oauth', 'password', 'grade']));
			next();
		});
	});
	
	server.put(apiPrefix + '/profile', function (req, res, next) {
		var model/* = req.user.role == 1 ? db.student : db.judge*/;
		switch(req.user.role) {
			case 1:
				model = db.student;
				model.findById(req.user.id).then(function (user) {
					if (user == null) return next(new notFound());
					user.fullName = req.body.firstName + ' ' + req.body.lastName;
					user.email = req.body.email;
					user.save();
					res.json({
						result: true
					});
				});
				break;
				
			case 2:
				model = db.judge;
				model.findById(req.user.id).then(function (user) {
					if (user == null) return next(new notFound());
					user.fullName = req.body.firstName + ' ' + req.body.lastName;
					user.email = req.body.email;
					user.save();
					res.json({
						result: true
					});
				});
				break;
				
			case 3:
				model = db.user;
				model.findById(req.user.id).then(function (user) {
					if (user == null) return next(new notFound());
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
				break;
		}
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
