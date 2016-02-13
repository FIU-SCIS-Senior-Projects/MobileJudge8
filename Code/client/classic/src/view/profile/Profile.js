Ext.define('MobileJudge.view.profile.Profile', {
	extend: 'Ext.panel.Panel',
	xtype: 'myProfile',

	requires: [
		'Ext.Button',
		'Ext.Container'
	],

	layout: {
		type: 'vbox',
		align: 'middle'
	},
	
	controller: 'myProfile',
	viewModel: 'myProfile',

	bodyPadding: 20,

	items: [
		{
			xtype: 'image',
			cls: 'userProfilePic',
			height: 120,
			width: 120,
			alt: 'profile-picture',
			margin: '10',
			bind: {
				src: '{profileImgUrl}'
			}
		},
		{
			xtype: 'component',
			html: '<b>*First Name</b>'
		},
		{
			xtype: 'textfield',
			required: true,
			bind: {
				value: '{firstName}'
			}
		},
		{
			xtype: 'component',
			html: '<b>*Last Name</b>'
		},
		{
			xtype: 'textfield',
			required: true,
			bind: {
				value: '{lastName}'
			}
		},
		{
			xtype: 'component',
			html: '<b>*Email</b>'
		},
		{
			xtype: 'textfield',
			required: true,
			bind: {
				value: '{email}'
			}
		},
		{
			xtype: 'component',
			html: '<b>*Password</b>'
		},
		{
			xtype: 'textfield',
			inputType: 'password',
			bind: {
				value: '{password}'
			}
		},
		{
			xtype: 'component',
			html: '<b>*Retype Password</b>'
		},
		{
			xtype: 'textfield',
			inputType: 'password',
			bind: {
				value: '{retypePassword}'
			}
		},
		{
			xtype: 'component',
			html: '<b>Profile Image Url</b>'
		},
		{
			xtype: 'component',
			html: 'You can upload any of your pictures online by pasting the URL in the field.'
		},
		{
			xtype: 'textfield',
			bind: {
				value: '{profileImgUrl}'
			}
		},
		{
			xtype: 'button',
			margin: 10,
			width: 220,
			text: 'Save Changes',
			handler: 'updateProfile',
			platformConfig: {
				classic: {
					scale: 'large'
				},
				modern: {
					ui: 'action'
				}
			}
		}
	]
});
