Ext.define('MobileJudge.view.grade.Index', {
	extend: 'Ext.tab.Panel',
	xtype: 'grade',

	requires: [
		'Ext.view.View',
		'Ext.grid.Panel',
		'Ext.grid.column.Action',
		'Ext.toolbar.Paging',
		'Ext.toolbar.Toolbar',
		'Ext.form.Panel',
		'Ext.form.field.File'
	],

	controller: 'grade',
	viewModel: {
		type: 'grade'
	},

	cls: 'shadow',
	activeTab: 0,
	margin: 20,

	defaults: {
		cls: 'user-grid',
		viewConfig: {
			preserveScrollOnRefresh: true,
			preserveScrollOnReload: true,
			loadMask: false
		},

		headerBorders: false,
		rowLines: false
	},

	items: [
		{
			xtype: 'gradestudents',
			title: 'Students',
			iconCls: 'x-fa fa-graduation-cap',
			plugins: [
				{
					ptype: 'rowediting',
					pluginId: 'gridEditor'
				}
			]
		}
	]
});
