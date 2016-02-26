Ext.define('MobileJudge.view.people.Judges', {
	extend: 'Ext.grid.Panel',
	alias: ['widget.textclearfield', 'widget.judges'],

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],
	
	

	bind: '{judges}',
	
	plugins: [
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
						storeId: 'judges',
						mode: 'SIMPLE'
					},
					tpl: [
						'<tpl for=".">',
							'<button type="button" title="{name}">{abbr}</button>',
						'</tpl>'
					],
					bind: {
						selection: '{judgeFilterSelection}',
						store: '{judgeStates}'
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
						store: '{judges}'
					}
				},
				'->',
				{
					xtype: 'form',
					reference: 'judgeUploadForm',
					items: [
						{
							xtype: 'filefield',
							name: 'judgesCsv',
							buttonOnly: true,
							buttonText: 'Import',
							buttonConfig: {
								ui: 'soft-blue',
								glyph:'',
								iconCls: 'x-fa fa-cloud-upload'
							},
							listeners: {
								change: 'onImportJudges'
							}
						}
					]
				},
				{
					ui: 'soft-blue',
					glyph:'',
					iconCls: 'x-fa fa-cloud-download',
					text: 'Export Judges',
					handler: 'doExportJudges'
				}

			]
		},
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: '{judges}',
			showPageCombo: true //This config enables the page size select combo box
		}
	],
	columns: [
		{
			width: 75,
			dataIndex: 'id',
			hideable: false,
			text: ''
		},
		{
			renderer: function(value) {
				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
			},
			width: 75,
			dataIndex: 'profileImgUrl',
			sortable: false,
			hideable: false,
			text: ''
		},
		{
			dataIndex: 'firstName',
			text: 'First Name',
			flex: 1,
			editor: {
				xtype: 'textfield'
			}	
		},
		{
			dataIndex: 'lastName',
			text: 'Last Name',
			flex: 1,
			editor: {
				xtype: 'textfield'
			}	
		},
		{
			dataIndex: 'email',
			text: 'Email',
			flex: 2,
			editor: {
				xtype: 'textfield'
			}
		},
		{
			text: 'Password',
			dataIndex: 'password',
			flex: 1,
			renderer: function() {
				return '<div style="color:#888888">Password not displayed</div>';
			},
			editor: {
				xtype: 'textfield',
				inputType:'password'
			}
		},
		{
			dataIndex: 'title',
			text: 'Title',
			flex: 1,
			editor: {
				xtype: 'textfield'
			}
		},
		{
			dataIndex: 'affiliation',
			text: 'Affiliation',
			flex: 1,
			editor: {
				xtype: 'textfield'
			}
		},
		{
			dataIndex: 'state',
			text: 'State',
			width: 120,
			editor: {
                xtype: 'combo',
                editable: false,
                store: [
                	'Prospective',
                	'Invited',
                	'Rejected',
                	'Pending',
                	'Registered',
                	'Attended',
                	'Started Grading',
                	'Graded',
                	'Removed'
                ]
            }
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onUserDelete'
				}
			],

			width: 40,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
