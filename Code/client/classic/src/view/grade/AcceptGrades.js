Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.acceptgradewizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card'
    ],
    
    bodyPadding: 10,
    scrollable: true,
    controller: 'people',
    
    width: 600,
    height: 500,
    title: 'Temporal Title', 
    // initComponent: function() {
    //     this.callParent(arguments);
    // },

    loadData: function(record){
        //this.update(record.data);
        //Ext.create('studentsdetails');
        console.log("Got in here");
    },
    
    items: [
        {
            tpl: [
                '<div>'+
                    '<p>Name: {fullName}</p>'+
                    '<p>Project: {projectName}</p>'+
                    '<p>Grade: {grade}</p>' +
                '</div>'
            ]    
        },
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
    columns: [{
        xtype: 'gridcolumn',
        text: 'Judge',
        dataIndex: 'name',
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
        text: 'Grade1',
        dataIndex: 'grade1',
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
        text: 'Grade2',
        dataIndex: 'grade1',
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
        text: 'Grade3',
        dataIndex: 'grade1',
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
        text: 'Grade4',
        dataIndex: 'grade1',
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
        text: 'Grade5',
        dataIndex: 'grade5',
        flex: 2,
        width:120,
        editor: {
				xtype: 'numberfield',
				minValue: 1,
				maxValue: 10,
				allowBlank: false
			}
    }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 500,
    width: 600,
    renderTo: Ext.get('acceptgrademodal'),
});

Ext.create('Ext.data.Store', {
    storeId:'testData',
    fields:['name', 'grade1', 'grade2','grade3', 'grade4', 'grade5',],
    data:{'items':[
        { 'name': 'Lisa',  "grade1":8,  "grade2":9, "grade3":9, "grade4":9, "grade5":9,  },
        { 'name': 'Bart',  "grade1":9,  "grade2":8, "grade3":9, "grade4":9, "grade5":9,  },
        { 'name': 'Homer', "grade1":9,  "grade2":9, "grade3":8, "grade4":9, "grade5":9,  },
        { 'name': 'Homer', "grade1":9,  "grade2":9, "grade3":9, "grade4":8, "grade5":9,  },
        { 'name': 'Marge', "grade1":9,  "grade2":9, "grade3":9, "grade4":8, "grade5":8,  }
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});