/*
 * Make sure to update the view table 'students' in the database in case of errors with the backend
*/

var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

	server.post(apiPrefix + '/views_table/judges', function(req, res, next) {
        //  console.log("Got into get views table judges", req.params.studentId);
         
		db.term.getActiveTerm()
                .then(function(term){
                    Promise.all([
                        db.students_by_judge.findAll({
                            where: {
                                studentId: req.params.studentId
                            }
                        }),
                        db.grade.findAll({
                            where: {
                                studentId: req.params.studentId
                            }
                        }),
                        db.user.findAll({
                            where: {
                                role: 2
                            }
                        }),
                        db.question.findAll({
                        })
                    ]).then(function(arr){
                        res.json({
                            students: arr[0],
                            grades: arr[1],
                            judges: arr[2],
                            questions: arr[3]
					   });
					next();
                    })
            });
            next();
     });

	server.get(apiPrefix + '/views_table', function(req, res, next) {
		db.term.getActiveTerm()
			.then(function (term) {
                return fetch.Promise.all([
                    db.student_grade.findAll({
                        where: {
                            termId: 5//term.id
                        }
                    }),
                    db.grade.findAll({
                        where: {
                            termId: 5//term.id
                        }
                    })
                ]).then(function(arr){
                    var students = arr[0];
                    //var grades = arr[1];
                    
                    // var states = {
                    //     'acc': false,
                    //     'rej': false,
                    //     'pen': false
                    // }
                    
                    // students.forEach(function(student){
                    //     grades.forEach(function(grade){
                    //         if(student.studentId == grade.studentId){
                    //             while(!states.acc || !states.rej || !states.pen){
                    //                 if(grade.state == 1)//1 Means Accepted
                    //                     states.acc = true;
                    //                 else if(grade.state == 2)//2 Means Rejected
                    //                     states.rej = true;
                    //                 else 
                    //                     states.pen = true; //0 Means Pending
                    //             }
                    //             //Changing the state value
                    //             if(states.acc && !states.rej && !states.pen)
                    //                 student.gradeStatus = "Accepted";
                    //             else if(!states.acc && states.rej && !states.pen)
                    //                 student.gradeStatus = "Rejected";
                    //             else
                    //                 student.gradeStatus = "Pending";
                    //         }
                    //     })
                    // })
                    res.json(students);
                    next();
                })
            });
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

    server.put(apiPrefix + '/views_table_changeAll', function(req, res, next) {
        console.log(req.body)
        var state = req.body.state;
        console.log(state);
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
        console.log("Started the DB Access");
        db.term.getActiveTerm()
                .then(function(term){
                    console.log("Got the Term, ",term.id);
                    fetch.Promise.all([
                        db.user.findAll({
                            where: {
                                termId: 5,//term.id
                                role: 1
                            }
                        }),
                        db.grade.findAll({
                            where: {
                                termId: 5//term.id
                            }
                        })
                    ]).then(function(arr){
                        console.log("Got all the data needed");
                        var users = arr[0];
                        var grades = arr[1];
                        
                        //console.log(users[0]);
                        ids.forEach(function(id){
                            //console.log("Started the First Loop");
                            users.forEach(function(student){
                                if(id == student.id){
                                    //console.log(id," -GradeStatus-- ", student.id);
                                    student.gradeStatus = state;
                                    //console.log("User gradeStatus", student.gradeStatus);
                                    student.save();
                                    //console.log("Saved the user");
                                }
                            })
                        })
                        // ids.forEach(function(id){
                        //     //console.log("Started the Second Loop");
                        //     grades.forEach(function(grade){
                        //         if(id == grade.studentId){
                        //             //console.log(id," -Grade- ", grade.studentId);
                        //             grade.state = stateId;
                        //             //console.log("User gradeStateId", grade.state);
                        //             grade.save();
                        //             //console.log("Saved the grade");
                        //         }
                        //     })
                        // })
                        res.json({result: true});
                    })
            });
            next();
     });
    
	return epilogue.resource({
		model: db.student_grade,
		excludeAttributes: ['password','oauth'],
		//actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName', 'projectName' ]
		},
		endpoints: [apiPrefix + '/views_table', apiPrefix + '/views_table/:id']
	});
};





















































// var epilogue = require('epilogue'),
// 	Promise = require('bluebird'),
// 	fetch = require('node-fetch'),
// 	_ = require('lodash');
    
    
    
//  module.exports = function(server, db) {
// 	var trim = /^\/|\/$/g;
    
//     server.get(apiPrefix + '/views_table', function(req, res, next) {

// 		db.term.getActiveTerm()
//                 .then(function(term){
//                 //console.log("Got here", term.id);
//                 db.student_grade.findAll({
//                     where: {
//                         termId: 5//term.id
//                     }
//                 }).then(function(grades){
//                     //console.log("This is printing the grades",grades);
//                 res.json(grades);
//                 next();
//                 })
//             });
//      });
     
    
//      server.post(apiPrefix + '/views_table/judges', function(req, res, next) {
//         //  console.log("Got into get views table judges", req.params.studentId);
         
// 		db.term.getActiveTerm()
//                 .then(function(term){
//                     Promise.all([
//                         db.students_by_judge.findAll({
//                             where: {
//                                 studentId: req.params.studentId
//                             }
//                         }),
//                         db.grade.findAll({
//                             where: {
//                                 studentId: req.params.studentId
//                             }
//                         }),
//                         db.user.findAll({
//                             where: {
//                                 role: 2
//                             }
//                         }),
//                         db.question.findAll({
//                         })
//                     ]).then(function(arr){
//                         res.json({
//                             students: arr[0],
//                             grades: arr[1],
//                             judges: arr[2],
//                             questions: arr[3]
// 					   });
// 					next();
//                     })
//             });
//             next();
//      });
     
//      server.put(apiPrefix + '/views_table/changeAll', function(req, res, next) {
//         //  console.log("Got into get views table judges", req.params.studentId);
//          console.log(req.params);
// 		// db.term.getActiveTerm()
//         //         .then(function(term){
//         //             Promise.all([
//         //                 db.user.findAll({
//         //                     where: {
//         //                         termId: 5,//term.id
//         //                         role: 1
//         //                     }
//         //                 }),
//         //                 db.grade.findAll({
//         //                     where: {
//         //                         termId: 5,//term.id
//         //                     }
//         //                 }),
//         //             ]).then(function(arr){
//         //                 var users = arr[0];
//         //                 var grades = arr[1];
                        
//         //                  //res.json({
                            
// 		// 			   //});
// 		// 			next();
//         //             })
//         //     });
//         //     next();
//      });
     
//      server.post(apiPrefix + '/api/views_table/saveData', function(req, res, next) {
//          //console.log("Got into get views table judges", req.params.studentId);
//          console.log(req.params);
// 		// db.term.getActiveTerm()
//         //         .then(function(term){
//         //             Promise.all([
//         //                 db.students_by_judge.findAll({
//         //                     where: {
//         //                         studentId: req.params.studentId
//         //                     }
//         //                 }),
//         //                 db.grade.findAll({
//         //                     where: {
//         //                         studentId: req.params.studentId
//         //                     }
//         //                 }),
//         //                 db.user.findAll({
//         //                     where: {
//         //                         role: 2
//         //                     }
//         //                 }),
//         //                 db.question.findAll({
//         //                 })
//         //             ]).then(function(arr){
//         //                 res.json({
//         //                     students: arr[0],
//         //                     grades: arr[1],
//         //                     judges: arr[2],
//         //                     questions: arr[3]
// 		// 			   });
// 		// 			next();
//         //             })
//         //     });
//             next();
//      });
        
//     server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
                
//                 var value = req.body.gradeStatus;
//                 var state = 0;
//                 var theModel = db.user;
                
                
//                 if(value == "Pending"){
//                     value = "Accepted";
//                     state = 1;
//                     //console.log("Accepted");
//                 }
//                 else if(value == "Accepted"){
//                     value = "Rejected";
//                     state = 2;
//                     //console.log("Rejected");
//                 }
//                 else
//                 {
//                     value = "Pending";
//                     state = 0;
//                     //console.log("Pending");
//                 }
                
//                 //console.log("Saving by id");
                
//                 theModel.findById(req.params.id).then(function (user) {
//                     db.grade.findAll({
//                             where: {
//                                 studentId: req.params.studentId
//                             }
//                         }).then(function(grades){
//                             //console.log("Saved the grades", grades);
//                             grades.forEach(function(grade){
//                                 //console.log("This is a grade +++++++++++++++++++++++++++++++++++++++++++++++++++++++=", grade.state);
//                                 //console.log("cHANGING STATE");
//                                 grade.state = state;
//                                 grade.save();  
//                             })
//                             user.gradeStatus = value;
//                             user.save();
//                             res.json({result: true});
//                         })
                        
//                 });
//                 next();
//      });
        
        
        
//         return epilogue.resource({
//         	model: db.student_grade,
//             excludeAttributes: ['password','oauth'],
//             actions: ['list'],
//         	search: {
//         		param: 'query',
//         		attributes: [ 'fullName', 'projectName' ]
//         	},
//             //actions: ['create', 'read', 'update', 'delete'],
//         	endpoints: [apiPrefix + '/views_table', apiPrefix + '/views_table/:id']
//         });
// }