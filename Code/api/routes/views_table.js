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
        var count = 0;
        ids.forEach(function(id){
            fetch.Promise.all([
                db.user.findAll({
                    where: {
                        id: id,
                        role: 1
                    }
                }),
                db.grade.findAll({
                    where: {
                        studentId: id
                    }
                })
            ]).then(function(arr){
                var users = arr[0];
                var grades = arr[1];
                
                    users.forEach(function(student){
                        grades.forEach(function(grade){
                            console.log(student.id,"==", grade.studentId, "=================>", stateId);
                        if(student.id == grade.studentId){
                            grade.state = stateId;
                            grade.save();
                        }
                    })
                    student.gradeStatus = state;
                    console.log("saving the status of all main page", student.gradeStatus);
                            student.save();
                        count++;
                        if(count === ids.length)
                        {
                            res.json({result: true});
                        }
                    })
            })
        });
        next();
    });
    
    server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        
		var value = req.body.gradeStatus;
        var state = 0;
        var theModel = db.user;
        
        if(value == "Pending"){
            value = "Accepted";
            state = 1;
        }
        else if(value == "Accepted"){
            value = "Rejected";
            state = 2;
        }
        else
        {
            value = "Pending";
            state = 0;
        }
        
        theModel.findById(req.params.id).then(function (user) {
            db.grade.findAll({
                    where: {
                        studentId: req.params.studentId
                    }
                }).then(function(grades){
                    grades.forEach(function(grade){
                        grade.state = state;
                        grade.save();  
                    })
                    user.gradeStatus = value;
                    user.save();
                    res.json({result: true});
                })
        });
        next();
	});
    
	return epilogue.resource({
		model: db.student_grade,
		pagination: true,
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName' ]
		},
        endpoints: [apiPrefix + '/views_table']
	});
};


	// server.post(apiPrefix + '/views_table/judges', function(req, res, next) {
    //     //  console.log("Got into get views table judges", req.params.studentId);
         
	// 	db.term.getActiveTerm()
    //             .then(function(term){
    //                 Promise.all([
    //                     db.students_by_judge.findAll({
    //                         where: {
    //                             studentId: req.params.studentId
    //                         }
    //                     }),
    //                     db.grade.findAll({
    //                         where: {
    //                             studentId: req.params.studentId
    //                         }
    //                     }),
    //                     db.user.findAll({
    //                         where: {
    //                             role: 2
    //                         }
    //                     }),
    //                     db.question.findAll({
    //                     })
    //                 ]).then(function(arr){
    //                     res.json({
    //                         students: arr[0],
    //                         grades: arr[1],
    //                         judges: arr[2],
    //                         questions: arr[3]
	// 				   });
	// 				next();
    //                 })
    //         });
    //         next();
    //  });

    // // THIS IS NOT NEEEDED TO GET THE DATA
	// server.get(apiPrefix + '/views_table', function(req, res, next) {
	// 	console.log("This are the params passed");
    //     console.log(req.params);
        
    //     //SETUP of VARIABLES offset: '0', count: '25', abbr: [ 'DR', 'IN', 'AC' ]
        
    //     if(req.params.offset)
    //         var offset = parseInt(req.params.offset);
    //     if(req.params.count)
    //         var count = parseInt(req.params.count);   
    //     if(req.params.abbr)
    //         var abbr = req.params.abbr;  
            
            
    //     db.term.getActiveTerm()
	// 		.then(function (term) {
    //             return fetch.Promise.all([
    //                 db.student_grade.findAll({
    //                     where: {
    //                         termId: 5//term.id
    //                     }
    //                 }),
    //                 db.grade.findAll({
    //                     where: {
    //                         termId: 5//term.id
    //                     }
    //                 })
    //             ]).then(function(arr){
    //                 var students = arr[0];
    //                 res.json(students);
    //                 next();
    //             })
    //         });
	// });

	
	// server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        
	// 	var value = req.body.gradeStatus;
    //     var state = 0;
    //     var theModel = db.user;
        
    //     if(value == "Pending"){
    //         value = "Accepted";
    //         state = 1;
    //     }
    //     else if(value == "Accepted"){
    //         value = "Rejected";
    //         state = 2;
    //     }
    //     else
    //     {
    //         value = "Pending";
    //         state = 0;
    //     }
        
    //     theModel.findById(req.params.id).then(function (user) {
    //         db.grade.findAll({
    //                 where: {
    //                     studentId: req.params.studentId
    //                 }
    //             }).then(function(grades){
    //                 grades.forEach(function(grade){
    //                     grade.state = state;
    //                     grade.save();  
    //                 })
    //                 user.gradeStatus = value;
    //                 user.save();
    //                 res.json({result: true});
    //             })
    //     });
    //     next();
	// });