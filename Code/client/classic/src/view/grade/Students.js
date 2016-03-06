Ext.define('MobileJudge.view.grade.Students', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.gradestudents',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],
    listeners: {    
        afterrender: 'changeIcon',
        painted: 'changeIcon',
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var zRec = iColIdx;
            var data = Ext.getStore("studentgradesview").data.items[iRowIdx];

            if (zRec < 3)
                Ext.widget('gradestudentdetailwizard').show().loadData(data);
        }
    },
    
	bind: '{studentgradesview}',
	references: 'gridStudents',
	plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        }),
        Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1
        }),
		{
			ptype: 'rowediting',
			pluginId: 'gridEditor',
			listeners: {
				cancelEdit: 'onQuestionCancelEdit'
			}
		}
	],
    

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'checkboxfield',
					checked   : true,
					handler:'onCheckChange'
				},
				{
					xtype: 'dataview',
					cls: 'stateSelector',
					loadMask: false,
					trackOver: false,
					itemSelector: '.stateSelector button',
					selectedItemCls: 'selected',
					selectionModel: {
						type: 'dataviewmodel',
						storeId: 'studentgradesview',
						mode: 'SIMPLE'
					},
					tpl: [
						'<tpl for=".">',
						'<button type="button" title="{name}">{abbr}</button>',
						'</tpl>'
					],
					bind: {
						selection: '{studentFilterSelection}',
						store: '{studentStates}'//Make sure this gets added
					},
					listeners: {
						selectionchange: 'onFilterChange'
					}
				},
				'->',
				{
					xtype: 'searchfilter',
					width: 400,
					fieldLabel: 'Search',
					labelWidth: 50,
					bind: {
						store: '{studentgradesview}'
					}
				},
				'->',
                {
                    id: 'topIcon',
                    xtype: 'image',
                    hight: 30,
                    src: '/resources/images/icons/Green.ico',
                    width: 40,
                    dataIndex: 'bool',
                    sortable: false,
                    hideable: false,
                    // listener:{
                    //     change: 'onStateChange'
                    // }
                },
				{
                    ui: 'soft-blue',
                    id: 'allButton',
                    xtype: 'button',
                    text: 'Accept-All',
                    handler: 'statusManager',
                    flex: 1
                },
			]
		},
	],
	columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'projectName',
            text: 'Project',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'fullName',
            text: 'Name',
            flex: 1
        },
        {
        	xtype: 'gridcolumn',
        	dataIndex: 'grade',
        	text: 'Grade',
        	flex: 1
        },
        {
            id: 'status',
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
                
                var ctlr = this.up().up().up().getController();
                ctlr.changeIcon();
                
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
	]
});
