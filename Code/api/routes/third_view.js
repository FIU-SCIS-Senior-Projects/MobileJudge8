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
       
    server.put(apiPrefix + '/third_view_save', function(req, res, next) {
        var stateId = 0;
        var count = 0;
        var data = req.params.data;
//         { data: [ { studentId: 105658, judgeId: 123, questionId: 16 } ],
//   state: 'Accepted' }
        
        
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
        
        data.forEach(function(obj){
            fetch.Promise.all([
                db.grade.update({state: stateId}, {
                    where: {
                        studentId: obj.studentId,
                        judgeId: obj.judgeId,
                        questionId: obj.questionId
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === data.length)
                    {
                        res.json({result: true});
                    }
                })
        });
	});
    
    server.post(apiPrefix + '/third_view_save_edited', function(req, res, next) {
        //console.log(req.params);
        var data = req.params;
        var count = 0;
        data.forEach(function(obj){
            fetch.Promise.all([
                db.grade.update({value: obj.grade}, {
                    where: {
                        studentId: obj.studentId,
                        judgeId: obj.judgeId,
                        questionId: obj.questionId
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === data.length)
                    {
                        res.json({result: true, data: data});
                    }
                })
        });
        
        
        
        // console.log(data);
        // data.forEach(function(clientData){
        //     fetch.Promise.all([
        //         db.grade.findAll({
        //                     where: {
        //                         studentId: obj.studentId,
        //                         judgeId: obj.judgeId
        //                     }
        //                 })
        //         ]).then(function(arr){
        //             console.log(arr);
        //         })
        // })
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
    
	return epilogue.resource({
		model: db.judges_grade,
        endpoints: [apiPrefix + '/third_view']
	});
};