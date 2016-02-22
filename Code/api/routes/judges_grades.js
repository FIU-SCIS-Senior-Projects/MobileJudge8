var epilogue = require('epilogue'),
	Promise = require('bluebird'),
	fetch = require('node-fetch'),
	_ = require('lodash');
    
    
    
 module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.get(apiPrefix + '/judges_grades', function(req, res, next) {
        
        // var sendGrades = function(grades){
		// 	res.json(grades);
		// 	next();
		// };
        console.log("Got here in Judges Grades");
        
		db.term.getActiveTerm()
                .then(function(term){
                console.log("Got here", term.id);
                db.judges_grade.findAll({
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
        
        
        
        
        server.put(apiPrefix + '/judges_grades/:id', function(req, res, next) {
        // console.log('THIS IS A TEST', req.params.id);
        // var id = req.params.id.split("-");
        // console.log(id[1]);
        console.log(req);
		db.term.getActiveTerm()
                .then(function(term){
                console.log("Got here", term.id);
                db.judges_grade.findAll({
                    where: {
                        termId: term.id
                    }
                }).then(function(grade){
                    console.log("THIS IS THE FIRST FUCKING", grade);
                    db.judges_grade.findById(req.params.id).then(function(grade){
                        console.log("This is printing the grades",grade);
                        console.log(grade);
                        res.json(grade);
                        next();  
                    })
                })
            });
     });
        
        
        
        // return epilogue.resource({
        // 	model: db.judges_grade,
        // 	//excludeAttributes: ['password','oauth'],
        // 	//actions: ['list'],
        // 	// search: {
        // 	// 	param: 'query',
        // 	// 	attributes: [ 'fullName', 'project', 'email' ]
        // 	// },
        // 	endpoints: [apiPrefix + '/judges_grades', apiPrefix + '/judges_grades/:id']
        // });
}