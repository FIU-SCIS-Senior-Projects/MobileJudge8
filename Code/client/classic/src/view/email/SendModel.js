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
		hasSearched: false,
		fieldLabelText: 'Search:',

		filters: [],
		extraEmailText: '',
	
		fullStudents: [],
		fullJudges: [],
		judgesStart: [],
		studentsStart: [],
		studentsAdded: false,
		judgesAdded: false,
		uncheckedStudents: [],
		uncheckedJudges: [],
		selectedStudents: [],
		selectedJudges: [],
		selectedExtra: [],
		judgeNum: 0,
		studentNum: 0,
		
		template: '',
		preview: {
			subject: '',
			body: ''
		}
	},

	formulas: {
		caption: function(get) { return get('atEnd') ? 'Send' : 'Next'; },
		studentsSelection: function(get) { return get('selectedStudents'); },
		fieldLabelTextSelection: function(get) {return get('fieldLabelText');},

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
				hasSearched:  '{hasSearched}',
				extraEmails: '{extraEmailArray}',
				template: '{template}',
				studentNum: '{studentNum}',
				judgeNum: '{judgeNum}',
				selectedStudents: '{selectedStudents}',
				selectedJudges: '{selectedJudges}',
				selectedExtra: '{selectedExtra}'
			},
			get: function (data) {
				console.log('called get');
				if(data.hasSearched) return false;
				if (data.atStart) return data.filters.length > 0 || data.extraEmails.length > 0;
				if (data.atEnd) return !Ext.isEmpty(data.template);
				return (data.judgeNum + data.studentNum + data.selectedExtra.length) > 0 && !data.hasSearched;
			}
		}
	}
});
