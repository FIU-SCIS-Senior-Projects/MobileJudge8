/*
 * Make sure to update the view table 'students' in the database in case of errors with the backend
*/

var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

    server.put(apiPrefix + '/views_table_changeAll', function(req, res, next) {
        var state = req.body.state;
        var ids = req.body.ids;
		var stateId = 0;
        var count = 0;
        
        if(state == "Accepted"){
            stateId = 1;
        }
        else if(state == "Rejected"){
            stateId = 2;
        }
        else
        {
            stateId = 0;
        }
        ids.forEach(function(id){
            fetch.Promise.all([
                db.grade.update({state: stateId}, {
                    where: {
                        studentId: id
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === ids.length)
                    {
                        res.json({result: true});
                    }
                })
        });
        next();
    });
    
    server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        
		var value = req.body.gradeStatus;
        var stateId = 0;
        
        if(value == "Pending"){
            value = "Accepted";
            stateId = 1;
        }
        else if(value == "Accepted"){
            value = "Rejected";
            stateId = 2;
        }
        else
        {
            value = "Pending";
            stateId = 0;
        }
        fetch.Promise.all([
            db.grade.update({state: stateId}, {
                where: {
                    studentId: req.params.studentId
                }
            }),
        ]).then(function(arr){
                res.json({result: true});
            })
	});
    
	return epilogue.resource({
		model: db.student_grade,
		pagination: true,
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName', 'gradeStatus' ]
		},
        endpoints: [apiPrefix + '/views_table']
	});
};
