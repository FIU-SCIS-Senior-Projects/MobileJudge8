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
            var iteration = 0;
            var response = [];
            var acc = false;
            var rej = false;
            var pen = false;
            var count = 1;
            var obj = {
                            judgeName: judge_grades[0].judge,
                            gradeAverage: 0,
                            gradeStatus: "",
                            studentId: judge_grades[0].studentId,
                            judgeId: judge_grades[0].judgeId 
                        };
            
            judge_grades.forEach(function(jg){
                if(obj.judgeId != jg.judgeId){
                    
                    if(pen) obj.gradeStatus = "Pending";
                    else if(acc) obj.gradeStatus = "Accepted";
                    else obj.gradeStatus = "Rejected";
                    
                    
                    obj.gradeAverage = obj.gradeAverage;
                    response.push(obj);
                    acc = false;
                    rej = false;
                    pen = false;
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
                    console.log(acc, pen, rej);
                    obj.gradeAverage = obj.gradeAverage + jg.grade;
                    if(jg.accepted == "Accepted") acc = true;
                    else if(jg.accepted == "Pending") pen = true;
                    else rej = true;
                    count ++;
                }
                iteration++;
                if(iteration == judge_grades.length){
                    res.json(response);
                }
            })
        })
        next();
	});
    
    server.put(apiPrefix + '/second_view_save', function(req, res, next) {

        var stateId = 0;
        var count = 0;
        var data = req.params.data;
        console.log(req.params.state);
        
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
            fetch.Promise.all([
                db.grade.findAll({
                    where: {
                        studentId: data[0].studentId,
                        judgeId: data[0].judgeId
                    }
                }),
            ]).then(function(arr){
                //console.log("returned from the fetch");
                    var grades = arr[0];
                    data.forEach(function(obj){
                        grades.forEach(function(grade){
                            if(grade.judgeId == obj.judgeId){
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        count++;
                        console.log("finished obj number ", count, "and the data lenght is ", data.length, "for the first part");
                        if(count === data.length)
                        {
                            console.log("Got in first part");
                            res.json({result: true});
                            next();
                        }
                    })
                })    
        }
        else{
            fetch.Promise.all([
                db.grade.findAll({
                    where: {
                        studentId: data[0].studentId
                    }
                }),
            ]).then(function(arr){
                    var grades = arr[0];
                    data.forEach(function(obj){
                        grades.forEach(function(grade){
                            if(grade.judgeId == obj.judgeId){
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        count++;
                        console.log("finished obj number ", count, "and the data lenght is ", data.length);
                        if(count === data.length)
                        {
                            console.log("Got in here");
                            res.json({result: true});
                            next();
                        }
                    })
                })
        }
	});
    
	return epilogue.resource({
		model: db.judges_grade,
        endpoints: [apiPrefix + '/second_view']
	});
};