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
        // console.log('THIS IS A TEST', req.params.id);
        // var id = req.params.id.split("-");
        // console.log(id[1]);
        console.log(req);
		db.term.getActiveTerm()
                .then(function(term){
                console.log("Got here", term.id);
                db.student_grade.findAll({
                    where: {
                        termId: term.id
                    }
                }).then(function(grade){
                    console.log("THIS IS THE FIRST FUCKING", grade);
                    db.student_grade.findById(req.params.id).then(function(){
                        console.log("This is printing the grades",grade);
                        console.log(grade);
                        res.json(grade);
                        next();  
                    })
                })
            });
     });
        
        
        
        return epilogue.resource({
        	model: db.student_grade,
        	//excludeAttributes: ['password','oauth'],
        	//actions: ['list'],
        	search: {
        		param: 'query',
        		attributes: [ 'fullName', 'project', 'email' ]
        	},
        	endpoints: [apiPrefix + '/views_table', apiPrefix + '/views_table/:id']
        });
}