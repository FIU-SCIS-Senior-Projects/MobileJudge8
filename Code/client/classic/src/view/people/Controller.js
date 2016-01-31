Ext.define('MobileJudge.view.people.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.people',

	windows: {},
	model: null,
	deleteRecord: {},

	init: function(view) {
		this.model = view.getViewModel();
	},

	onStatesLoaded: function(store, records) {
		var filter = store.getStoreId().replace(/States/, 'Filter');
		this.model.set(filter, records);
	},

	onFilterChange: function(selModel, selections) {
		var filter = selections.map(function(r) { return r.get('abbr'); });
		this.model.getStore(selModel.storeId).filter('abbr', Ext.isEmpty(filter) ? 'XX' : filter);
		// update intermediate state

	},

	onCheckChange: function(checkbox) {
		var model = checkbox.up('toolbar').down('dataview').getSelectionModel();
		if (checkbox.checked == true)
		{
			console.log("checking select call ");
			model.selectAll();
		}
		else
		{
			console.log("checking unselect call ");
			model.deselectAll();
		}
	},

	onUserDelete: function(grid, rowIndex) {
		var store = grid.getStore(), id = store.getAt(rowIndex).get('id');

		Ext.Msg.confirm('Delete', 'Are you sure you want to delete the selected record?',
			function(choice) {
				if (choice !== 'yes') return;
				Ext.getBody().mask();
				Ext.Ajax.request({
					url: '/api/users/'+ id,
					method: 'DELETE',
					callback: function() {
						Ext.getBody().unmask();
					},
					success: function() {
						store.reload();
					}
				});
			});
	},

	onStudentsLoad: function(btn) {
		var me = this;
		btn.setDisabled(true);
		btn.setText('Please Wait');

		Ext.Ajax.request({
			url: '/api/students/change',
			success: function(resp) {
				var tpl = new Ext.XTemplate(
					'<span style="font-size:14px">Students</span><hr />',
					'<span style="text-align:right;width:80px;display:inline-block;">Dropped:&nbsp;</span>{students.dropped}<br />',
				    '<span style="text-align:right;width:80px;display:inline-block;">Update:&nbsp;</span>{students.update}<br />',
					'<span style="text-align:right;width:80px;display:inline-block;">New:&nbsp;</span>{students.new}<br />',
					'<tpl if="students.woProject &gt; 0">',
						'<span style="text-align:right;width:80px;display:inline-block;">No Projects:&nbsp;</span>{students.woProject}<br />',
					'</tpl>',
					'<br />',
					'<span style="font-size:14px">Projects</span><hr />',
					'<span style="text-align:right;width:80px;display:inline-block;">Deactivate:&nbsp;</span>{projects.deactivate}<br />',
					'<span style="text-align:right;width:80px;display:inline-block;">Update:&nbsp;</span>{projects.update}<br />',
					'<span style="text-align:right;width:80px;display:inline-block;">New:&nbsp;</span>{projects.new}<br />'
				);
				Ext.Msg.confirm('Apply this changes?', tpl.apply(Ext.decode(resp.responseText)),
					function(choice) {
						if (choice !== 'yes') {
							btn.setText('Sync');
							btn.setDisabled(false);
							return;
						}

						Ext.Ajax.request({
							url: '/api/students',
							method: 'POST',
							callback: function() {
								btn.setText('Sync');
								btn.setDisabled(false);
								//.getView().refresh();
							},
							success: function() {
								//Ext.Msg.alert('Success', 'Changes applied!', function() {
									me.model.getStore('students').reload();
								//});
							}
						});
					});
			}
		});
	},

	onImportJudges: function() {
		var me = this;
		var form = this.lookupReference('judgeUploadForm').getForm();
		form.submit({
			url: '/api/judges/import',
			waitMsg: 'Importing judges...',
			success: function(form, action) {
				me.model.getStore('judges').reload();
				var tpl = new Ext.XTemplate(
					'File processed on the server.<br />',
					'Name: {fileName}<br />',
					'Size: {fileSize:fileSize}<br /><hr />',
					'Processed: {total}<br />',
					'Inserted: {records}<br />',
					'Skipped: {skipped}'
				);
				Ext.Msg.alert('Success', tpl.apply(action.result));
			},
			failure: function(form, action) {
				console.log(action);
				Ext.Msg.alert("Error", action.response.responseText);
			}
		});
	}
});
