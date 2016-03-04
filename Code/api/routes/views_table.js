var epilogue = require('epilogue'),
	Promise = require('bluebird'),
	fetch = require('node-fetch'),
	_ = require('lodash');
    
    
    
 module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.get(apiPrefix + '/views_table', function(req, res, next) {

		db.term.getActiveTerm()
                .then(function(term){
                    Promise.all([
                        db.student_grade.findAll({
                            where: {
                                termId: 5//term.id
                            }
                        }),
                        db.grade.findAll({
                            where: {
                                termId: 5//term.id
                            }
                        }),
                    ]).then(function(arr){
                        var students = arr[0];
                        var grades = arr[1];
                        console.log("Git sstudents and grades");
                        
                            students.forEach(function(student){
                                
                                console.log("Checking data and Value");
                                var acceptedGrades = false;
                                var pendingGrades = false;
                                var rejectedGrades = false;
                                
                                grades.forEach(function(grade){
                                    if(student.studentId == grade.studentId){
                                          switch(grade.state) {
                                                    case 0:
                                                        acceptedGrades = true;
                                                        break;
                                                    case 1:
                                                        pendingGrades = true;
                                                        break;
                                                    case 2:
                                                        rejectedGrades = true;
                                                        break;
                                                    default:
                                                        pendingGrades = true;
                                                }                                    
                                    }
                                })
                                
                                //Set an initial status
                                student.gradeStatus = "Pending";
                                
                                //Check what states are present
                                if(pendingGrades == false && rejectedGrades == false && student.acceptedGrades == true)
                                    student.gradeStatus = "Accepted";
                                if(acceptedGrades == false && rejectedGrades == false && student.pendingGrades == true)
                                      student.gradeStatus = "Pending";
                                if(acceptedGrades == false && pendingGrades == false && student.rejectedGrades == true)
                                      student.gradeStatus = "Rejected";
                                      
                             
                            })
                                console.log("This is the end promise", students);
                                res.json(students);
                    })
                    
                })
     });
     
     server.post(apiPrefix + '/views_table/judges', function(req, res, next) {
         console.log("Got into get views table judges", req.params.studentId);
         
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
                            //console.log("Saved the grades", grades);
                            grades.forEach(function(grade){
                                console.log("This is a grade +++++++++++++++++++++++++++++++++++++++++++++++++++++++=", grade.state);
                                
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