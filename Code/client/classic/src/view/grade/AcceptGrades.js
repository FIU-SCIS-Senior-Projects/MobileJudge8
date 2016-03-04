Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.acceptgradewizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card',
        'Ext.Component'
    ],
    
    bodyPadding: 10,
    scrollable: true,
    controller: 'grade',
    modal : true,
    
    width: 500,
    height: 400,
    title: 'Student Grade by One Judge', 
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record){
        // accepted: 5
        // fullName: "Diana Bone"
        // gradeAverage: NaN
        // graded: 5
        // id: "extModel8-4"
        // judgeId: 114
        // judgeName: "Eric Johnson"
        // location: "Location 3"
        // profileImgUrl: "http://spws.cis.fiu.edu/Senior-Project-Web-Site-Ver-5/img/no-photo.jpeg"
        // project: "Smart Building Ver 2.0"
        // studentId: 1358788
        // total: 5
        var requestData = {
            studentId : record.data.studentId
        }
        $("#judgeNameLabel").text(record.data.judgeName);
        $("#studentNameLabel").text(record.data.fullName);
        $("#projectNameLabel").text(record.data.project);
        $("#gradeNameLabel").text(record.data.grade);
        
        Ext.Ajax.request({
            url: '/api/views_table/judges',
            success: function(response){
                var data = JSON.parse(response.responseText)
                data.judges.forEach(function(judge){
                    data.students.forEach(function(student){
                        if(student.judgeId == judge.id)
                            student.judgeName = judge.fullName;
                    })
                })
                data.students.forEach(function(student){
                    var tempAverage = 1;
                        data.grades.forEach(function(grade){
                            if(student.judgeName == grade.judge && student.fullName == grade.student && student.project == grade.projectName)
                            {
                                student.gradeAverage = student.gradeAverage + grade.grade;
                                tempAverage ++;
                            }    
                        })
                        student.gradeAverage = student.gradeAverage / tempAverage;
                    })
                
                this.dataArray = data;
                
                Ext.getStore('studentDetailData').loadData(data.students);
            },
            failure: this.updateError,
            jsonData : requestData,
            disableCaching:true,
            method:'POST'		   
        });
    },
    
    tbar: {
        items: [
            {
                name: 'thePanel',
                xtype: 'panel', 
                items: [
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Judge:',
                                    readOnly : true
                                },
                                {
                                    id: 'judgeNameLabel',
                                    xtype: 'label',
                                    text: 'Masoud Sadjadi',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 30px'
                                }
                          ]
                        },
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Name:',
                                    readOnly : true
                                },
                                {
                                    id: 'studentNameLabel',
                                    xtype: 'label',
                                    text: 'Rodolfo Viant',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 30px'
                                }
                          ]
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Project:',
                                    readOnly : true
                                },
                                {
                                    id: 'projectNameLabel',
                                    xtype: 'label',
                                    text: 'Mobile Judge 8',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 25px'
                                }
                          ]
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Grade:',
                                    readOnly : true
                                },
                                {
                                    id: 'gradeNameLabel',
                                    xtype: 'label',
                                    text: '8',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 28px'
                                }
                          ]
                        }
                ]
            }
        ],
        renderTo: Ext.getBody()
	},
    
    items: [
        {
            xtype: 'acceptGrade'
        }
    ]
});

Ext.define('MobileJudge.view.grade.acceptGrade', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.acceptGrade',
    store: 'testData',
    initComponent: function() {
         this.callParent()
    },
    columns: [
        {
        xtype: 'gridcolumn',
        text: 'Question',
        dataIndex: 'question',
        flex: 2,
        width:120
    },{
        xtype: 'gridcolumn',
        text: 'Grade',
        dataIndex: 'grade',
        flex: 2,
        width:120,
        editor: {
				xtype: 'numberfield',
				minValue: 1,
				maxValue: 10,
				allowBlank: false
			}
    },{
        xtype: 'gridcolumn',
        text: 'Comment',
        dataIndex: 'comment',
        flex: 2,
        width:120,
        editor: {
				xtype: 'textField',
				allowBlank: false
			}
    }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 300,
    width: 400,
    renderTo: Ext.get('acceptgrademodal')
});

Ext.create('Ext.data.Store', {
    storeId:'testData',
    fields:['question', 'comment', 'grade'],
    data:{'items':[
        { 'question': 'First Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Second Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Thids Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Fourth Question',  "comment":"This is great",  "grade":9},
        { 'question': 'Fifth Question',  "comment":"This is great",  "grade":9}
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});