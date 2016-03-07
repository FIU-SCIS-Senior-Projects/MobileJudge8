var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

server.post(apiPrefix + '/third_view', function(req, res, next) {
        
        db.judges_grade.findAll({
            where: {
                studentId: req.params.studentId,
                judgeId: req.params.judgeId
            }
        }).then(function(judge_grades){
                res.json(judge_grades);
            })
        next();
	});
    
    server.post(apiPrefix + '/third_view_save_edited', function(req, res, next) {
        console.log(req.params[0].studentId);
        var data = req.params;
        //console.log(data);
        data.forEach(function(clientData){
            fetch.Promise.all([
                db.grade.findAll({
                            where: {
                                studentId: obj.studentId,
                                judgeId: obj.judgeId
                            }
                        })
                ]).then(function(arr){
                    console.log(arr);
                })
        })
        // fetch.Promise.all([
        //     db.grade.findAll({
        //                 where: {
        //                     studentId: obj.studentId,
        //                     judgeId: obj.judgeId,
        //                     questionId: obj.questionId
        //                 }
        //             })
        // ]).then(function(arr){
        //     console.log("THIS IS THE END");
        //     // console.log(arr[0].length) 
        //         // var grades = judge_grades;
        //         // grades.forEach(function(grade){
        //         //     data.forEach(function(clientGrade){
        //         //         if(grade.questionId === clientGrade.questionId){
        //         //             grade.value = clientGrade.grade;
        //         //             grade.save();
        //         //             console.log("saved");
        //         //         }
        //         //     })
        //         // })
        //         // res.json(judge_grades);
        //     })
        next();
	});   
       
    server.put(apiPrefix + '/third_view_save', function(req, res, next) {
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
                            judgeId: obj.judgeId,
                            questionId: obj.questionId
                        }
                    })
                ]).then(function(arr){
                    var users = arr[0];
                    var grades = arr[1];
                    
                    users.forEach(function(user){
                        grades.forEach(function(grade){
                            if(user.id == grade.studentId){;
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        if(stateId == 0)
                            user.gradeStatus = "Pending";
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
        endpoints: [apiPrefix + '/third_view']
	});
};