var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.post(apiPrefix + '/second_view', function(req, res, next) {
        
        db.judges_grade.findAll({
            where: {
                studentId: req.params.studentId,
            }
        }).then(function(judge_grades){
            var response = [];
            var acc, rej, pen;
            var count;
            var obj = {
                            judgeName: "",
                            gradeAverage: 0,
                            gradeStatus: "",
                            studentId: null,
                            judgeId: null  
                    };
            
            judge_grades.forEach(function(jg){
                if(obj.judgeName ==  ""){
                    acc, rej, pen = false;
                    count = 1;
                    obj = {
                            judgeName: jg.judge,
                            gradeAverage: jg.grade,
                            gradeStatus: "",
                            studentId: jg.studentId,
                            judgeId: jg.judgeId 
                        }
                }
                else if(obj.judgeName != jg.judge){
                    if(acc && !pen) obj.gradeStatus = "Accepted";
                    else if(!acc && rej && !pen) obj.gradeStatus = "Rejected";
                    else obj.gradeStatus = "Pending";
                    obj.gradeAverage = obj.gradeAverage;//Average Not Needed / count;
                    response.push(obj);
                    acc, rej, pen = false;
                    count = 1;
                    obj = {
                            judgeName: jg.judge,
                            gradeAverage: jg.grade,
                            gradeStatus: "",  
                            studentId: jg.studentId,
                            judgeId: jg.judgeId
                        }
                }
                else{
                    obj.gradeAverage = obj.gradeAverage + jg.grade;
                    if(jg.accepted == "Accepted") acc = true;
                    else if(jg.accepted == "Pending") pen = true;
                    else rej = true;
                    count ++;
                }
            })
            res.json(response);
        })
        next();
	});
    
    server.put(apiPrefix + '/second_view_save', function(req, res, next) {
        console.log(req.params);

        var stateId = 0;
        var count = 0;
        var data = req.params.data;
        var acc, pen, rej = 0;
        
        if(req.params.state == "Accepted"){
            stateId = 1;
        }
        else if(req.params.state == "Rejected"){
            stateId = 2;
        }
        else
        {
            stateId = 0;
        }
        if(data.length == 1){
            data.forEach(function(obj){
                fetch.Promise.all([
                    //Intentionally done this way
                    db.user.findAll({
                        where: {
                            id: obj.studentId,
                            role: 1
                        }
                    }),
                    db.grade.findAll({
                        where: {
                            studentId: obj.studentId,
                            judgeId: obj.judgeId
                        }
                    })
                ]).then(function(arr){
                    var users = arr[0];
                    var grades = arr[1];
                    
                    users.forEach(function(user){
                        console.log("Got here once");
                        grades.forEach(function(grade){
                            if(user.id == grade.studentId){;
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        count++;
                        if(count === data.length)
                        {
                            res.json({result: true});
                        }
                    })
                })
            });
        }
        else{
            data.forEach(function(obj){
                fetch.Promise.all([
                    //Intentionally done this way
                    db.user.findAll({
                        where: {
                            id: obj.studentId,
                            role: 1
                        }
                    }),
                    db.grade.findAll({
                        where: {
                            studentId: obj.studentId
                        }
                    })
                ]).then(function(arr){
                    var users = arr[0];
                    var grades = arr[1];
                    
                    users.forEach(function(user){
                        grades.forEach(function(grade){
                            if(user.id == grade.studentId){
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        user.gradeStatus = req.body.state;
                        user.save();
                        count++;
                        if(count === data.length)
                        {
                            res.json({result: true});
                        }
                    })
                })
            });
        }
        next();
	});
    
	return epilogue.resource({
		model: db.judges_grade,
        endpoints: [apiPrefix + '/second_view']
	});
};