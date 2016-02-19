Ext.define('MobileJudge.view.email.SendModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.sendemail',

	stores: {
		emaillists: {
			type: 'emaillists',
			storeId: 'emaillists',
			listeners: {
				load: 'onSelectEmailsLoaded'
			}
		},

		students: {
			type: 'contacts',
			storeId: 'studentcontacts',
			listeners: {
				load: 'onStudentPageLoad'
			}
		},

		judges: {
			type: 'contacts',
			storeId: 'judgecontacts',
			listeners: {
				load: 'onJudgePageLoad'
			}
		},

		extraEmails: {
			type: 'array',
			storeId: 'extraEmails',
			model: 'MobileJudge.model.email.Contact',
			pageSize: 0
		}
	},

	data: {
		atStart: true,
		atEnd: false,

		filters: [],
		extraEmailText: '',
	
		fullStudents: [],
		fullJudges: [],
		uncheckedStudents: [],
		uncheckedJudges: [],
		selectedStudents: [],
		selectedJudges: [],
		selectedExtra: [],
		
		template: '',
		preview: {
			subject: '',
			body: ''
		}
	},

	formulas: {
		caption: function(get) { return get('atEnd') ? 'Send' : 'Next'; },
		studentsSelection: function(get) { return get('selectedStudents'); },
		fullStudentsSelection: function(get) { return get('fullStudents');},
		fullJudgesSelection: function(get) { return get('fullJudges');},
		uncheckedStudentsSelection: function(get) { return get('uncheckedStudents');},
		checkedStudentsSelection: function(get) {
			var checked = [];
			for(i=0; i<get('selectedStudents').length; i++){
				var found = false;
				for(j=0; j<get('uncheckedStudents').length;j++){
					if(get('selectedStudents')[i].id
						=== get('uncheckedStudents')[j].id){

						found = true;
					}
				}
				if(!found){
					checked.push(get('selectedStudents')[i]);
				}
			}
			return checked;

		},
		checkedJudgesSelection: function(get) {
			var checked = [];
			for(i=0; i<get('selectedJudges').length; i++){
				var found = false;
				for(j=0; j<get('uncheckedJudges').length;j++){
					if(get('selectedJudges')[i].id
							 === get('uncheckedJudges')[j].id){
						found = true;
					}
				
				}
				if(!found){
					checked.push(get('selectedJudges')[i]);
				}
			}
			return checked;
		},
		judgesSelection: function(get) { return get('selectedJudges'); },
		extraSelection: function(get) { return get('selectedExtra'); },
		importJudges: {
			bind: {
				id: '{template}'
			},
			get: function(data) {
				if (Ext.isEmpty(data.id)) return false;
				var template = Ext.getStore('templates').getById(data.id);
				if (!template) return false;
				return template.get('body').indexOf('[[accept]]') >= 0;
			}
		},
		extraEmailArray: {
			bind: {
				extraEmails: '{extraEmailText}'
			},
			get: function(data) {
				var reg = /^((?:[\w\.\-_]+)?\w+@\w+(?:\.\w+){1,})(?:\,([^\,\n\r]*))?(?:\,(\w*))?$/igm;
				var res = [], text = data.extraEmails;

				var match = reg.exec(text);
				while (match != null) {
					var firstName = match[2] || '',
						lastName = match[3] || '';

					res.push({
						firstName: firstName,
						lastName: lastName,
						fullName: firstName + ' ' + lastName,
						email: match[1]
					});
					match = reg.exec(text);
				}

				return res;
			}
		},
		canMoveNext: {
			bind: {
				atStart: '{atStart}',
				atEnd: '{atEnd}',
				filters: '{filters}',
				extraEmails: '{extraEmailArray}',
				template: '{template}',
				selectedStudents: '{selectedStudents}',
				selectedJudges: '{selectedJudges}',
				selectedExtra: '{selectedExtra}'
			},
			get: function (data) {
				if (data.atStart) return data.filters.length > 0 || data.extraEmails.length > 0;
				if (data.atEnd) return !Ext.isEmpty(data.template);
				return (data.selectedStudents.length + data.selectedJudges.length + data.selectedExtra.length) > 0;
			}
		}
	}
});
