Ext.define('MobileJudge.ux.form.WizardSearchField', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.searchfilterwizard',

    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            handler: 'onClearClick',
            scope: 'this'
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            handler: 'onSearchClick',
            scope: 'this'
        }
    },

    paramName : 'query',
    hasSearch : false,

    config: {
        storeStudents: null,
        storeJudges: null
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
            else if (e.getKey() == e.ESC) {
                me.onClearClick();
            }
        });
    },

    onClearClick : function(){
        var me = this,
            activeFilter = me.activeFilter;

        if (activeFilter) {
            me.setValue('');

            //var grid = this.up('refineselection').down('gridpanel');
            //var studentIndex = me.storeStudents.indexOf(me.storeStudents.findRecord( 'fullName', activeFilter, 0, true, false, false ));
            //var judgeIndex = me.storeJudges.indexOf(me.storeJudges.findRecord( 'fullName', activeFilter, 0, true, false, false ));
            me.storeStudents.getFilters().remove(activeFilter);
            me.storeJudges.getFilters().remove(activeFilter);
            me.activeFilter = null;
            me.getTrigger('clear').hide();
            me.updateLayout();
        }
    },

    onSearchClick : function(){
        var me = this,
            value = me.getValue();

        if (value.length > 0) {
            // Param name is ignored here since we use custom encoding in the proxy.
            // id is used by the Store to replace any previous filter
            me.activeFilter = new Ext.util.Filter({
                property: me.paramName,
                value: value
            });


            //var grid = this.up('refineselection').down('gridpanel');
           // var studentIndex = me.storeStudents.indexOf(me.storeStudents.findRecord( 'fullName', value, 0, true, false, false ));
            //console.log(studentIndex);
            //var judgeIndex = me.storeJudges.indexOf(me.storeJudges.findRecord( 'fullName', value, 0, true, false, false ));
            //grid.getView().focusRow(studentIndex);
            //grid.getView().getNode(studentIndex).scrollRowIntoView();
            //var studentGrid =  Ext.ComponentQuery.query('[name=[studentGrid]');
            //studentGrid.scrollRowIntoView(studentIndex);
            me.storeStudents.getFilters().add(me.activeFilter);
            me.storeJudges.getFilters().add(me.activeFilter);

            me.getTrigger('clear').show();
            me.updateLayout();

        }
    }
});
