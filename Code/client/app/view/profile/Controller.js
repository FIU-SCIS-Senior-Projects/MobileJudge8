Ext.define('MobileJudge.view.profile.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.myProfile',

	model: null,
	loginInProcess: false,

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
	
	onLinkAccount: function(view){
		var me = this, win = view.mask ? view : Ext.Viewport;
		$('.btn-oauth').click(function(e) {
			e.preventDefault();
			var cls = e.currentTarget.className.split(' '), provider = cls.pop();
			provider = (provider == 'x-btn-over' ? cls.pop() : provider).split('-')[2];

			if (me.loginInProcess) return;
			me.loginInProcess = true;
			OAuth.popup(provider, function(err, res) {
				if (err) {
					me.loginInProcess = false;
					Ext.Msg.alert("Error", Ext.isString(err) ? err : err.message);
				}
				else res.me().done(function (data) {
					console.log(data);
					me.requestToken(win, {
						provider: provider,
						id: data.id,
						email: data.email
					});
					//var id = JSON.stringify(data);
					var email = data.email;
					var parsedData = {
						provider: {
							id: data.id
						}
					}
					console.log(JSON.stringify(parsedData));


					Ext.Ajax.request({
						url: '/api/profile',
						method: 'PUT',
						jsonData: parsedData
						//success: function(resp) {
						//}
					});




				});
			});


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
	},

	requestToken: function(win, data) {
		var me = this;

		win.mask();
		Ext.Ajax.request({
			url: '/api/login',
			method: 'POST',
			jsonData: data,
			callback: function() {
				me.loginInProcess = false;
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				win.unmask();
				if (!obj.result) {
					Ext.Msg.alert("Error", obj.error);
				}
				else {
					Ext.Object.each(obj.profile, localStorage.setItem, localStorage);
					localStorage.setItem('token', obj.token);
					Ext.GlobalEvents.fireEvent('login');
				}
			}
		});
	}
});
