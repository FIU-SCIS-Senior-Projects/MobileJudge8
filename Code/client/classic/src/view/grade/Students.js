Ext.define('MobileJudge.view.grade.Students', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.gradestudents',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar',
        'Ext.Viewport'
	],

	bind: '{studentgradesview}',
    references: 'gridStudents',

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ], 
    listeners: {
        painted: 'loadStudentsGrades',
        itemClick: function(dv, record, item, index, e){
            this.data = record;
        },
        cellclick: function(iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent){
            var zRec = iColIdx;
            if(zRec < 3)
                Ext.widget('grademodal').show().loadData(this.data);
            console.log(iRowEl);
        }
    }, 
    
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
						storeId: 'students',
						mode: 'SIMPLE'
					},
					tpl: [
						'<tpl for=".">',
						'<button type="button" title="{name}">{abbr}</button>',
						'</tpl>'
					],
					bind: {
						selection: '{studentFilterSelection}',
						store: '{studentStates}'
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
						store: '{students}'
					}
				},
				'->',
				{
					ui: 'soft-blue',
					glyph:'',
					iconCls: 'x-fa fa-cloud-download',
					text: 'Sync',
					handler: 'onStudentsLoad'
				},
				{
					ui: 'soft-blue',
					glyph:'',
					iconCls: 'x-fa fa-cloud-download',
					text: 'Export Grades',
					handler: 'doExportStudents'
				}
			]
		},
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: '{students}',
			showPageCombo: true //This config enables the page size select combo box
		}
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
			xtype: 'gridcolumn',
			dataIndex: 'gradeStatus',
			text: 'Status',
			flex: 1,
            editor: {
                xtype: 'combo',
                editable: false,
                store:[
                    'Accepted',
                    'Rejected',
                    'Pending'
                ],
                listeners: {
                    onUpdate: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
                        //console.log(gridPanel.getSelectionModel().getCurrentPosition());
                        console.log(iRecord);
                    },
                    onCancel: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
                        
                    }
                }
            }
		}
	]
});