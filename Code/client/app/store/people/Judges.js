Ext.define('MobileJudge.store.people.Judges', {
	extend: 'Ext.data.Store',
	alias: 'store.judges',

	model: 'MobileJudge.model.people.Judge',

	proxy: {
		type: 'api',
		url: '/api/judges',
		
		reader: {
			type: 'json',
			successProperty: 'success',
			messageProperty: 'message'
		},
	
		listeners: {
			exception: function(proxy, response, operation) {
				var res = JSON.parse(response.responseText);
				Ext.MessageBox.show({
					title: "Error!",
					msg: res.message,
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.Msg.OK
				});
			}
		}
	},

	remoteSort: true,
	remoteFilter: true,
	autoSync: true,
	pageSize: 25
});
