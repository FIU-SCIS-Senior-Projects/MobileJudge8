var epilogue = require('epilogue'),
	Promise = require('bluebird'),
	fetch = require('node-fetch'),
	_ = require('lodash');
    
    
    
 module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.get(apiPrefix + '/views_table', function(req, res, next) {
        
        // var sendGrades = function(grades){
		// 	res.json(grades);
		// 	next();
		// };
        
		db.term.getActiveTerm()
                .then(function(term){
                console.log("Got here", term.id);
                db.student_grade.findAll({
                    where: {
                        termId: term.id
                    }
                }).then(function(grades){
                    //console.log("This is printing the grades",grades);
                res.json(grades);
                next();
                })
            });
     });
        
        
        
        
        server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        //console.log('THIS IS A TEST ++++', req.body.gradeStatus);
		          
                  var value = req.body.gradeStatus;
                  var model = db.user;
                  
                  if(value == "Pending"){
                        console.log("FIrst ONe");
                        value = "Accepted";
                    }
                    else if(value == "Accepted"){
                        console.log("Second ONe");
                        value = "Rejected";
                    }
                    else
                    {
                        console.log("Third ONe");
                        value = "Pending";
                    }
                        
                    model.update({
                        gradeStatus: value,
                        }, {
                        where: {
                            id: req.body.id
                        }
                        }
                    );
                    console.log("Exiting");
                    next();
                  
                //console.log("Got here", term.id);
                // model.findAll({
                //     where: {
                //         id: req.params.id
                //     }
                // }).then(function(user){
                //     //console.log("THIS IS THE FIRST FUCKING", user);
                //     if(user.gradeStatus == "Pending"){
                //         user.gradeStatus = "Accepted";
                //     }
                //     else if(user.gradeStatus == "Accepted"){
                //         user.gradeStatus = "Rejected";
                //     }
                //     else
                //         user.gradeStatus = "Pending";
                //     model.update();
                //     console.log("Exiting");
                //     next();
                // });
        
     });
        
        
        
        return epilogue.resource({
        	model: db.student_grade,
        	//excludeAttributes: ['password','oauth'],
        	//actions: ['list'],
        	search: {
        		param: 'query',
        		attributes: [ 'fullName', 'project', 'email' ]
        	},
            actions: ['create', 'read', 'update', 'delete'],
        	endpoints: [apiPrefix + '/views_table', apiPrefix + '/views_table/:id']
        });
}