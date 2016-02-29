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
         console.log("Got into get views table judges", req.params.studentId);
         
		db.term.getActiveTerm()
                .then(function(term){
                    
                    Promise.all([
                        db.students_by_judge.findAll({
                            where: {
                                studentId: req.params.studentId
                            }
                        }),
                        db.judges_grade.findAll({
                            where: {
                                student: req.params.fullName
                            }
                        }), 
                        db.user.findAll({
                            where: {
                                role: 2
                            }
                        })
                    ]).then(function(arr){
                        res.json({
                            students: arr[0],
                            grades: arr[1],
                            judges: arr[2]
					   });
					next();
                    })
                    
                    // res.json(data);
                // })
            });
            next();
     });
        
        server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        //console.log('THIS IS A TEST ++++', req.body.gradeStatus);
        //console.log('THIS IS A TEST ++++', req.params.id);
		          
                  var value = req.body.gradeStatus;
                  var theModel = db.user;
                   
                  if(value == "Pending"){
                        //console.log("FIrst ONe");
                        value = "Accepted";
                    }
                    else if(value == "Accepted"){
                        //console.log("Second ONe");
                        value = "Rejected";
                    }
                    else
                    {
                        //console.log("Third ONe");
                        value = "Pending";
                    }
                    
                    theModel.findById(req.params.id).then(function (user) {
                       user.gradeStatus = value;
                       //console.log("Started Saving");
                       user.save();
                       //console.log("Exiting");
                       res.json({result: true});
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