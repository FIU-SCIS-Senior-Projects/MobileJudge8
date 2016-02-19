Ext.define('MobileJudge.model.profile.ProfileModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.myProfile',

	fields: [
		{ name: 'firstName',        type: 'string' },
		{ name: 'lastName',         type: 'string' },
		{ name: 'email',            type: 'string' },
		{ name: 'password',         type: 'string' },
		{ name: 'retypePassword',   type: 'string' },
		{ name: 'profileImgUrl',    type: 'string' }
	]
});
