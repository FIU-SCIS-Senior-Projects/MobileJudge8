Ext.define('MobileJudge.view.profile.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.myProfile',
  

	model: null,
	loginInProcess: false,
	view: null,

	init: function(view) {
		OAuth.setOAuthdURL("http://mj.cis.fiu.edu/oauthd");
		OAuth.initialize('uSO6GBdeGO_y9Bdas5jNHTLxBd8');
		this.model = view.getViewModel();
		this.loadProfile();
		this.view = view;
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
	
	onRender: function(){
		//Ext.form.Checkbox.superclass.afterRender.call(this);
		this.checked = true;
	},

	onLinkAccount: function(thisButton){
		var me = this, win = this.view.mask ? this.view : Ext.Viewport;
			

			me.loginInProcess = true;
			var nameArray = thisButton.ui.split('-');
			var provider = nameArray[0];
			Ext.Ajax.request({
				url: '/api/profile',
				method: 'GET',
				success: function(resp){
					var profile = Ext.decode(resp.responseText);
					var userOauth = "";
					var oauthList = JSON.parse(profile['oauth']);
					console.log(JSON.stringify(profile));
					for(var oauthKey in oauthList){
						console.log(oauthKey);
						if(oauthKey === provider){
							userOauth = oauthList[oauthKey];
						}
					}
					if(userOauth!==''){
						Ext.Msg.confirm("Warning", provider + " account is already linked, would you like to unlink it?", function(btn, text){
								console.log(btn);
								if(btn=='yes'){
									delete oauthList[provider];
									console.log('testing alert' + oauthList);
									oauthList['oauth'] =  true;
									Ext.Ajax.request({
										url: '/api/profile', 
										method: 'PUT',
										jsonData: oauthList,
										success: function (resp){
											Ext.Msg.alert("Success!", provider + " account has been unlinked");
										}
									});	
								}
						});
					}
					else{
						OAuth.popup(provider, function(err, res) {
							if (err) {
								me.loginInProcess = false;
								Ext.Msg.alert("Error", Ext.isString(err) ? err : err.message);
							}
							else res.me().done(function (data) {
								var email = data.email;
								var parsedData = oauthList;
								parsedData['oauth'] = true; 
								parsedData[provider]={
									id: data.id
								}
	

								Ext.Ajax.request({
									url: '/api/profile',
									method: 'PUT',
									jsonData: parsedData,
									success: function(resp){
										 Ext.Msg.alert("Success", provider + " account as been successfully linked"); 
									}
								});
							});
						
						});

					}
					var cbox = Ext.getCmp('linkedin2');
					cbox.checked = true;
				}
			});
	},

	updateProfile: function(btn) {
		var me = this;
		var profileModel = this.model;
		
		if(profileModel.data.firstName === undefined || profileModel.data.firstName == '' ||
		profileModel.data.lastName === undefined || profileModel.data.lastName == '' ||
		profileModel.data.email === undefined || profileModel.data.email == '') {
			Ext.Msg.alert('','You have empty fields');
			return;
		}
		
		var data = {
			firstName: profileModel.data.firstName,
			lastName: profileModel.data.lastName,
			email: profileModel.data.email,
			profileImg: profileModel.data.profileImgUrl
		}
		if(profileModel.data.password === undefined) {
			//do nothing
		} else if (profileModel.data.password != ''){
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
					Ext.Msg.alert('','Profile updated!');
				} else {
					profileModel.data.password = '';
					Ext.Msg.alert('','Something wrong, please try again');
				}
			}
		});
	}
});
