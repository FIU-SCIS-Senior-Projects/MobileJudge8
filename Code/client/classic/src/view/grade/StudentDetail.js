Ext.define('MobileJudge.view.grade.GradeStudentDetailWizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.gradestudentdetailwizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card',
        'Ext.Component'
    ],
  
    cls: 'wizardone',
    layout: 'card',
  
    bodyPadding: 10,
    scrollable: true,
    controller: 'grade',
    modal : true,
    
    width: 600,
    height: 375,
    title: 'Student Grades by Judges', 
    
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record) {
        var requestData = {
            studentId : record.data.studentId
        }
        $("#nameLabel").text(record.data.fullName);
        $("#projectLabel").text(record.data.projectName);
        $("#gradeLabel").text(record.data.grade);
    
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
                    var tempAverageCounter = 0;
                    var gradeAverage = 0;
                    student.grades = [];
                        data.grades.forEach(function(grade){
                            if(student.judgeId == grade.judgeId && student.studentId == grade.studentId)
                            {
                                //student.gradeAverage = student.gradeAverage + grade.grade;
                                gradeAverage = gradeAverage + grade.value;
                                tempAverageCounter ++;
                                student.grades.push(grade);
                            }    
                        })
                        student.gradeAverage = gradeAverage / tempAverageCounter;
                        student.questions = data.questions;
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
                id: 'thePanel',
                xtype: 'panel', 
                width: 400,
                items: [
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Name:',
                                    readOnly : true
                                },
                                {
                                    id: 'nameLabel',
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
                                    text: 'Project:',
                                    readOnly : true
                                },
                                {
                                    id: 'projectLabel',
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
                                    id: 'gradeLabel',
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
            itemId: 'middle',
            xtype: 'judgeaveragegrade',
            flex: 1
        }
    ]
});

Ext.define('MobileJudge.view.grade.JudgeAverageGrade', {
    extend:'Ext.grid.Panel',
    alias: 'widget.judgeaveragegrade',
    store: 'studentDetailData',
    initComponent: function() {
         this.callParent()
    },
    listeners: {
        afterrender:function (){
          console.log("Got here")  
        },
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var zRec = iColIdx;
            var data = Ext.getStore("studentDetailData").data.items[iRowIdx];

            if (zRec < 2){
                Ext.widget('acceptgradewizard').show().loadData(data);
                
            }
        }
    },
    columns: [
        {
            xtype: 'gridcolumn',
            text: 'Judge',
            dataIndex: 'judgeName',
            flex: 2,
            width:120
        },{
            xtype: 'gridcolumn',
            text: 'Grade',
            dataIndex: 'gradeAverage',
            flex: 2,
            width:120
        },
        {
            id: 'secondViewStatus',
            xtype: 'actioncolumn',
            text: 'Status',
            flex: 1,
            items: [
                {
                    icon: '/resources/images/icons/Green.ico',
                    tooltip: 'Status',
                    handler: 'onStateChange'
                } 
            ],
            renderer: function (value, metadata, record) {
                if (record.get('gradeStatus').toLowerCase() == "pending") {
                    this.items[0].tooltip = 'Pending';
                    this.items[0].icon = '/resources/images/icons/Yellow.ico';
                }else if (record.get('gradeStatus').toLowerCase() == "accepted") {
                    this.items[0].tooltip = 'Accepted';
                    this.items[0].icon = '/resources/images/icons/Green.ico';
                } else {
                    this.items[0].tooltip = 'Rejected';
                    this.items[0].icon = '/resources/images/icons/Red.ico'; 
                }
            },
            width: 40,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }
    ],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 500,
    width: 375,
    renderTo: Ext.get('grademodal')
});

Ext.create('Ext.data.Store', {
    storeId:'studentDetailData',
    fields:['judgeName', 'gradeAverage', 'status'],
    data:[
  {'judgeName':"Andres Villa"} 
 ]
});

