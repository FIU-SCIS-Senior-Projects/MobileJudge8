var epilogue = require('epilogue'),
	Promise = require('bluebird'),
	fetch = require('node-fetch'),
	_ = require('lodash');
    
    
    
 module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.get(apiPrefix + '/views_table', function(req, res, next) {

		db.term.getActiveTerm()
                .then(function(term){
                //console.log("Got here", term.id);
                db.student_grade.findAll({
                    where: {
                        termId: 5//term.id
                    }
                }).then(function(grades){
                    //console.log("This is printing the grades",grades);
                res.json(grades);
                next();
                })
            });
     });
    
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
     
     server.put(apiPrefix + '/views_table/changeAll', function(req, res, next) {
        //  console.log("Got into get views table judges", req.params.studentId);
         console.log(req.params);
		// db.term.getActiveTerm()
        //         .then(function(term){
        //             Promise.all([
        //                 db.user.findAll({
        //                     where: {
        //                         termId: 5,//term.id
        //                         role: 1
        //                     }
        //                 }),
        //                 db.grade.findAll({
        //                     where: {
        //                         termId: 5,//term.id
        //                     }
        //                 }),
        //             ]).then(function(arr){
        //                 var users = arr[0];
        //                 var grades = arr[1];
                        
        //                  //res.json({
                            
		// 			   //});
		// 			next();
        //             })
        //     });
        //     next();
     });
     
     server.post(apiPrefix + '/api/views_table/saveData', function(req, res, next) {
         //console.log("Got into get views table judges", req.params.studentId);
         console.log(req.params);
		// db.term.getActiveTerm()
        //         .then(function(term){
        //             Promise.all([
        //                 db.students_by_judge.findAll({
        //                     where: {
        //                         studentId: req.params.studentId
        //                     }
        //                 }),
        //                 db.grade.findAll({
        //                     where: {
        //                         studentId: req.params.studentId
        //                     }
        //                 }),
        //                 db.user.findAll({
        //                     where: {
        //                         role: 2
        //                     }
        //                 }),
        //                 db.question.findAll({
        //                 })
        //             ]).then(function(arr){
        //                 res.json({
        //                     students: arr[0],
        //                     grades: arr[1],
        //                     judges: arr[2],
        //                     questions: arr[3]
		// 			   });
		// 			next();
        //             })
        //     });
            next();
     });
        
    server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
                
                var value = req.body.gradeStatus;
                var state = 0;
                var theModel = db.user;
                
                
                if(value == "Pending"){
                    value = "Accepted";
                    state = 1;
                    //console.log("Accepted");
                }
                else if(value == "Accepted"){
                    value = "Rejected";
                    state = 2;
                    //console.log("Rejected");
                }
                else
                {
                    value = "Pending";
                    state = 0;
                    //console.log("Pending");
                }
                
                //console.log("Saving by id");
                
                theModel.findById(req.params.id).then(function (user) {
                    db.grade.findAll({
                            where: {
                                studentId: req.params.studentId
                            }
                        }).then(function(grades){
                            //console.log("Saved the grades", grades);
                            grades.forEach(function(grade){
                                //console.log("This is a grade +++++++++++++++++++++++++++++++++++++++++++++++++++++++=", grade.state);
                                //console.log("cHANGING STATE");
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
        	search: {
        		param: 'query',
        		attributes: [ 'fullName', 'project', 'email' ]
        	},
            actions: ['create', 'read', 'update', 'delete'],
        	endpoints: [apiPrefix + '/views_table', apiPrefix + '/views_table/:id']
        });
}