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
		},
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
					},
                    listeners:{
                        change: 'changeIcon'
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
                    listeners: {
                        el: {
                            click: 'statusManager'
                        }
                    },
                    tooltip: 'Accept-All',
                }//,
				// {
                //     ui: 'soft-blue',
                //     id: 'topIcon',
                //     xtype: 'button',
                //     text: 'Accept-All',
                //     handler: 'statusManager',
                //     flex: 1,
                //     icon: '/resources/images/icons/Green.ico'
                // },
			]
		},
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: '{studentgradesview}',
			showPageCombo: true 
		}
	],
	columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'project',
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
                
                var green = false;
                var red = false;
                var yellow = false;
                
                var ctlr = this.up().up().up().getController();
                ctlr.changeIcon();
                
                if (record.get('pending') == true) {
                    this.items[0].tooltip = 'Pending';
                    this.items[0].icon = '/resources/images/icons/Yellow.ico';
                    yellow = true;
                }
                if (record.get('accepted') == true) {
                    this.items[0].tooltip = 'Accepted';
                    this.items[0].icon = '/resources/images/icons/Green.ico';
                    green = true;
                } 
                if(record.get('rejected') == true){
                    this.items[0].tooltip = 'Rejected';
                    this.items[0].icon = '/resources/images/icons/Red.ico'; 
                    red = true;
                }
                
                if (green && red && yellow) {
                    this.items[0].tooltip = 'Acc && Pen && Rej';
                    this.items[0].icon = '/resources/images/icons/Red.ico'; 
                }else if(green && red) {
                    this.items[0].tooltip = 'Acc && Rej';
                    this.items[0].icon = '/resources/images/icons/RedGreen.ico'; 
                }else if(green && yellow) {
                    this.items[0].tooltip = 'Acc && Pen && Rej';
                    this.items[0].icon = '/resources/images/icons/RedYellow.ico'; 
                }else if(yellow && red) {
                    this.items[0].tooltip = 'Acc && Pen && Rej';
                    this.items[0].icon = '/resources/images/icons/RedYellowGreen.ico'; 
                }
    	    },
            width: 40,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }
	]
});
