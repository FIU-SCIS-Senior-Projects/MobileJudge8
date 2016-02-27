/*
 * Make sure to update the view table 'judges' in the database in case of errors with the backend
*/

var epilogue = require('epilogue'),
	badRequest = require('restify').errors.BadRequestError,
	fs = require('fs'),
	csv = require('csv'),
	crypt = require('../utils/crypt.js'),
	_ = require('lodash');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');

module.exports = function(server, db) {

	server.post(apiPrefix + '/judges/import', function(req, res, next) {
		if (req.files === undefined || req.files.judgesCsv === undefined) {
			return next(new badRequest('missing file'));
		}

		var file = req.files.judgesCsv;

		fetch.Promise.all([
			db.term.getActiveTerm({ attributes: ['id'] }),
			db.user.findAll({
				attributes: [[db.sequelize.fn('MAX', db.sequelize.col('id')), 'id']],
				where: {
					role: 2
				}
			})
		]).then(function (arr) {
			file.skipped = 0; file.records = 0;
			var termId = arr[0].id,
				id = (arr[1][0] || []).length == 0 ? 1 : arr[1][0].get('id'),
				regex = /(?:[\w\.\-_]+)?\w+@\w+(?:\.\w+){1,}/;
				transform = csv.transform(function (record, callback) {
					if (!regex.test(record.email)) {
						callback(null, null);
						return;
					}
					_.assign(record, {
						termId: termId,
						state: 1,
						role: 2,
						projectId: 0,
						location: 0
					});

					db.user.count({
						where: {
							email: record.email,
							'$or': [
								{termId: termId},
								{role: 2, state: 12}
							]
						}
					}).then(function (judges) {
						file.records++;
						if (judges != 0) file.skipped++;
						callback(null, judges != 0
								? null
								: _.assign(record, {
							id: id + file.records - file.skipped //transform.running - arr[2]
						}));
					});

				}, function (err, output) {
					if (err) {
						res.send(err.message);
						return next();
					}

					db.user.bulkCreate(output).then(function() {
						res.json({
							success: true,
							fileName: file.name,
							fileSize: file.size,
							total: file.records,
							records: output.length,
							skipped: file.skipped
						});
						next();
					});
				});

			fs.createReadStream(file.path)
				.pipe(csv.parse({
					columns: ['email', 'firstName', 'lastName'],
					skip_empty_lines: true,
					trim: true
				}))
				.pipe(transform);
		});
	});
	
	server.put(apiPrefix + '/judges/:id', function(req, res) {
	console.log(req.params);
		var promises = [];
		promises.push(db.user.findById(req.params.id));
		promises.push(db.user.findOne({where: {email: req.params.email}}));
		if(req.params.password) {
			promises.push(crypt.hashPassword(req.params.password));
		}
		fetch.Promise.all(promises).then(function (arr) {
			//arr[0] is for users
			//arr[1] is for email.....if any
			//arr[2] is for password..if any
			if(req.params.title || req.params.title === "") {
				arr[0].title = req.params.title;
			}
			if(req.params.affiliation || req.params.affiliation === "") {
				arr[0].affiliation = req.params.affiliation;
			}
			if(req.params.state) {
				switch(req.params.state) {
					case "Prospective":
						arr[0].state = 1;
						break;
					case "Invited":
						arr[0].state = 2;
						break;
					case "Rejected":
						arr[0].state = 3;
						break;
					case "Pending":
						arr[0].state = 4;
						break;
					case "Registered":
						arr[0].state = 5;
						break;
					case "Attended":
						arr[1].state = 6;
						break;
					case "Started Grading":
						arr[0].state = 7;
						break;
					case "Graded":
						arr[0].state = 8;
						break;
					case "Removed":
						arr[0].state = 12;
						break;
				}
			}
			if(req.params.firstName) {
				arr[0].firstName = req.params.firstName;
			}
			if(req.params.lastName) {
				arr[0].lastName = req.params.lastName;
			}
			if(req.params.email) {
				if(arr[1]) {
					return res.send({success: false, message: "Email already exists"});
				} else {
					arr[0].email = req.params.email;
				}
			}
			arr[0].save();
			return res.send(true);
		});
	});

	return epilogue.resource({
		model: db.judge,
		excludeAttributes: ['oauth', 'password'],
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'firstName', 'lastName', 'affiliation', 'email' ]
		},
		endpoints: [apiPrefix + '/judges']
	});
};
