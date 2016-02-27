Ext.define('MobileJudge.view.grade.GradeStudentDetailWizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.gradestudentdetailwizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card'
    ],
  
    cls: 'wizardone',
    layout: 'card',
  
    bodyPadding: 10,
    scrollable: true,
    controller: 'people',
    
    width: 600,
    height: 500,
    title: 'Student Grades by Judges', 
    
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record){
        this.update(record.data);
        //Ext.create('judgeaveragegrade');
        console.log(record);
    },
    
    // tbar: {
    //     // tpl:'<h1>{fullName}</h1>' + '<h1>{emaiprojectNamel}</h1>' +'<h1>{grade}</h1>',
	// 	items: [
	// 		{
    //             xtype: 'panel',
	// 			 tpl:'<h1>{fullName}</h1>' + '<h1>{emaiprojectNamel}</h1>' +'<h1>{grade}</h1>',
	// 		}
	// 	]
	// },
    
    items: [
        // {
        //     itemId: 'top',
        //     tpl: [
        //         '<div>'+
        //             '<p>Name: {fullName}</p>'+
        //         '</div>'+
        //         '<div>'+
        //             '<p>Project: {projectName}</p>'+
        //         '</div>'+
        //         '<div>'+
        //             '<p>Grade: {grade}</p>' +
        //         '</div>'
        //     ] 
		// },
        // {
        //     xtype: 'container',
            
        //     item: [
        //         {   
        //             xtype: 'field',
        //             text: 'Name:',
        //             flex: 1, 
        //         }
        //     ]
        // },
        // {
        //     xtype: 'field',
        //     text: 'Project:',
        //     dataIndex: 'projectName',
        //     flex: 2,
        //     width:120
        // },
        // {
        //     xtype: 'field',
        //     text: 'Grade:',
        //     dataIndex: 'grade',
        //     flex: 2,
        //     width:120
        // },
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
    store: 'mockData',
    initComponent: function() {
         this.callParent()
    },
    listeners: {
        itemClick: function (dv, record, item, index, e) {
            //this.data = record;
            Ext.widget('acceptgradewizard').show().loadData(this.data);
        },
    },
    columns: [{
        xtype: 'gridcolumn',
        text: 'Judge',
        dataIndex: 'name',
        flex: 2,
        width:120
    },{
        xtype: 'gridcolumn',
        text: 'Grade',
        dataIndex: 'gradeAvg',
        flex: 2,
        width:120
    },{
        xtype: 'gridcolumn',
        text: 'Status',
        dataIndex: 'status',
        flex: 2,
        width:120
    }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 500,
    width: 600,
    renderTo: Ext.get('grademodal'),
});

Ext.create('Ext.data.Store', {
    storeId:'mockData',
    fields:['name', 'grade1', 'grade2','grade3', 'grade4', 'grade5',],
    data:{'items':[
        { 'name': 'Lisa',  "gradeAvg":8,  'status':'Pending'  },
        { 'name': 'Bart',  "gradeAvg":9,  'status':'Pending'  },
        { 'name': 'Homer', "gradeAvg":6,  'status':'Pending'  },
        { 'name': 'Homer', "gradeAvg":5,  'status':'Pending'  },
        { 'name': 'Marge', "gradeAvg":9,  'status':'Pending'  }
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

