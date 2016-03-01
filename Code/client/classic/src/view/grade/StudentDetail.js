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
    model: null,
    bodyPadding: 10,
    scrollable: true,
    controller: 'grade',
    modal : true,
    width: 600,
    height: 375,
    title: 'Student Grades by Judges', 
    config: {
    	student : null
    },
    initComponent: function(view) {
	    this.callParent(arguments);
    },

    loadData: function(record){
	    console.log('loadData');
	    this.getConfig().student = record
        $("#nameLabel").text(record.data.fullName);
        $("#projectLabel").text(record.data.projectName);
        $("#gradeLabel").text(record.data.grade);
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
                                    style:'padding:0px 0px 0px 30px',
                                    //flex: 1
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
            flex: 1,
        }
    ]
});

Ext.define('MobileJudge.view.grade.JudgeAverageGrade', {
    extend:'Ext.grid.Panel',
    alias: 'widget.judgeaveragegrade',
    store: 'studentData',
    controller: 'grade',
    initComponent: function() {
         this.callParent()
    },
   
    listeners: {
	afterrender: function(){
	//console.log(this.student);	
	
	var testy = this.up().getConfig().student;
	if(testy == null){
		return;
	}
	var studentData = {
            studentId: "105658"
        }
		console.log('testing');
        Ext.Ajax.request({
            url: 'api/views_table/judges',
            method: 'POST',
            jsonData: studentData,
            success:function(response){
                var data = JSON.parse(response.responseText);
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
                            student.gradeAverage = grade.grade;
                            tempAverage++;
                        }
                    })
                    student.gradeAverage = student.gradeAverage / tempAverage;
                })
                console.log(data.students);
                Ext.getStore('studentData').loadData(data.students);
                console.log('printing store' + Ext.getStore('studentData').data);
            }
        });
	
    },
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var zRec = iColIdx;
            var studentData = Ext.getStore("firstPopUp").data.items[iRowIdx];

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
                    icon: '/resources/images/icons/Yellow.ico',
                    tooltip: 'Status',
                    handler: 'onStateChange'
                } 
            ],
            renderer: function (value, metadata, record) {
                // if (record.get('gradeStatus').toLowerCase() == "pending") {
                //     this.items[0].tooltip = 'Pending';
                //     this.items[0].icon = '/resources/images/icons/favicon(2).ico';
                // }else if (record.get('gradeStatus').toLowerCase() == "accepted") {
                //     this.items[0].tooltip = 'Accepted';
                //     this.items[0].icon = '/resources/images/icons/favicon(4).ico';
                // } else {
                //     this.items[0].tooltip = 'Rejected';
                //     this.items[0].icon = '/resources/images/icons/favicon(3).ico'; 
                // }
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
    renderTo: Ext.get('grademodal'),
});

Ext.create('Ext.data.Store', {
	storeId: 'studentData',
	fields:['judgeName','gradeAverage'],
	data:[
		{'judgeName':"Andres Villa"}	
	]
});

Ext.create('Ext.data.Store', {
    storeId:'mockData',
    fields:['name', 'grade1', 'grade2','grade3', 'grade4', 'grade5',],
    data:'',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
