Ext.define('MobileJudge.view.profile.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.myProfile',

	model: null,

	init: function(view) {
		this.model = view.getViewModel();
		this.loadProfile();
	},

	loadProfile: function() {
		var me = this;
		Ext.Ajax.request({
			url: '/api/profile',
			method: 'GET',
			success: function(resp) {
				var profile = Ext.decode(resp.responseText);
				Ext.each(profile, function(key) {
					me.model.set(key, profile[key]);
				});
			}
		});
	},
	
	updateProfile: function(btn) {
		var me = this;
		var profileModel = this.model;
		
		if(!profileModel.data.firstName || !profileModel.data.lastName || !profileModel.data.email) {
			Ext.Msg.alert('','You have empty fields');
			return;
		}
		
		var data = {
			firstName: profileModel.data.firstName,
			lastName: profileModel.data.lastName,
			email: profileModel.data.email,
			profileImg: profileModel.data.profileImgUrl
		}
		
		if(profileModel.data.password || profileModel.data.retypePassword) {
			if(profileModel.data.password == profileModel.data.retypePassword)
				data.password = profileModel.data.password;
			else {
				Ext.Msg.alert('','Passwords do not match');
				return;
			}
		}
		
		if (btn) btn.setDisabled(true);
		Ext.Ajax.request({
			url: '/api/profile',
			method: 'PUT',
			jsonData: data,
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				if (btn) btn.setDisabled(false);
				if(obj.result) {
					var fullName = profileModel.data.firstName + ' ' + profileModel.data.lastName;
					localStorage.setItem('userName', fullName);
					localStorage.setItem('profilePic', profileModel.data.profileImgUrl);
					Ext.GlobalEvents.fireEvent('loadProfile');
					var fields = Ext.ComponentQuery.query('[clearOnReset=true]');
					for (var ii = 0; ii < fields.length; ii++){
						fields[ii].reset();
					}
					Ext.Msg.alert('','Profile updated!');
					this.pw.value = '';
				} else {
					profileModel.data.password = '';
					Ext.Msg.alert('','Something went wrong, please try again');
				}
			}
		});
	}
});
