Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.grademodal',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card'
    ],

    // tpl: [
    //     '<div>'+
    //         '<p>Name: {fullName}</p>'+
    //         '<p>Project: {projectName}</p>'+
    //         '<p>Grade: {grade}</p>' +
    //      '</div>'
    //     ],
    
    bodyPadding: 10,
    scrollable: true,
    controller: 'people',
    
    width: 500,
    height: 400,
    title: 'Student Grades by Judges',
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record){
        this.update(record.data);
        Ext.create('studentsdetails');
    },
    
    items: [
        {
            tpl: [
                '<div>'+
                    '<p>Name: {fullName}</p>'+
                    '<p>Project: {projectName}</p>'+
                    '<p>Grade: {grade}</p>' +
                '</div>'
            ],    
        },
        {
            xtype: 'studentsdetails'
        }
    ]
})

Ext.define('MobileJudge.view.grade.Studentsdetails', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.studentsdetails',
    title: 'Simpsons',
    store: 'judgesgrades',
    initComponent: function() {
         this.callParent()
    },
    columns: [{
        xtype: 'gridcolumn',
        text: 'Judge',
        dataIndex: '',
        flex: 2,
        width:120
    },{
        xtype: 'gridcolumn',
        text: 'Grade',
        dataIndex: '',
        flex: 2,
        width:120
    },{
        xtype: 'gridcolumn',
        text: 'Status',
        dataIndex: '',
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
        storeId:'resumedStore',
        fields:['judgeName', 'grade', 'status'],
        data:{'items':[
            { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
            { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
            { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
            { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
        ]},
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });






// Ext.define('MobileJudge.ux.grade.StudentsDetails', {
// 	extend: 'Ext.grid.Panel',
// 	xtype: 'studentsdetails',

// 	userCls: 'user-grid shadow',
// 	title: 'Students Details',

// 	tools: [
// 		{
// 			type: 'refresh',
// 			handler: 'onStudentsRefresh'
// 		}
// 	],

// 	viewConfig: {
// 		stripeRows: true,
// 		enableTextSelection: false,
// 		loadMask: false,
// 		markDirty: false
// 	},

// 	disableSelection: true,
// 	enableColumnHide: false,
// 	enableColumnMove: false,
// 	enableColumnResize: false,
// 	sortableColumns: false,
// 	headerBorders: false,
// 	columns:[
// 		{
// 			renderer: function(value) {
// 				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
// 			},
// 			width: 75,
// 			dataIndex: 'profileImgUrl',
// 			text: ''
// 		},
// 		{
// 			dataIndex: 'fullName',
// 			text: 'Name',
// 			flex: 1
// 		},
// 		{
// 			dataIndex: 'project',
// 			text: 'Project',
// 			flex: 2
// 		}
// 	]
// });




