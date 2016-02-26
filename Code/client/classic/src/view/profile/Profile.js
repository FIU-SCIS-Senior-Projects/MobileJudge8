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
            html: '<b>Click icon to link account: </b>'
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            cls: 'social-login',
            defaultType: 'button',
            defaults: {
		    scale: 'large',
                width: 60
            },
            items: [
	    	{
			xtype: 'checkboxfield',
			width: 1,
			id: "google",
			html: '<div class="outer-div"><div class="seperator"></div></div>',
		},

                {
                    ui: 'google',
                    userCls: 'btn-oauth',
                    iconCls: 'x-fa fa-google-plus',
                    tooltip: 'Login with Google',
                    preventDefault: false,
                    handler: 'onLinkAccount'
                },
                {
                    xtype: 'checkboxfield',
                    width: 1,
		    id: "google",
                    html: '<div class="outer-div"><div class="seperator"></div></div>',
                    margin: '0 8',
		    readOnly: true,
		    listeners: {
		    	afterrender: 'onRender'
		    }
                },
                {
                    ui: 'linkedin2',
                    userCls: 'btn-oauth',
                    iconCls: 'x-fa fa-linkedin',
                    tooltip: 'Login with LinkedIn',
                    preventDefault: false,
                    handler: 'onLinkAccount'
                },
                {
		    xtype: 'checkboxfield',
		    width: 1,
		    id: 'linkedin2',
                    html: '<div class="outer-div"><div class="seperator"></div></div>',
                    margin: '0 15'
                },
                {
                    ui: 'facebook',
                    userCls: 'btn-oauth',
                    iconCls: 'x-fa fa-facebook',
                    tooltip: 'Login with Facebook',
                    preventDefault: false,
                    handler: 'onLinkAccount'
                },
                {
                    xtype: 'checkboxfield',
                    width: 1,
                    html: '<div class="outer-div"><div class="seperator"></div></div>',
                    margin: '0 8px'
                },
                {
                    ui: 'twitter',
                    userCls: 'btn-oauth',
                    iconCls: 'x-fa fa-twitter',
                    tooltip: 'Login with Twitter',
                    preventDefault: false,
                    handler: 'onLinkAccount'
                },
		{
		   xtype: 'checkboxfield',
		   width: 1,
		   html: '<div class="outer-div"><div class="seperator"></div></div>',
		   margin: '0 8'
		}
            ]
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
