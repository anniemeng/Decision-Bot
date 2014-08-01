var app = app || {};

app.viewOptions = Backbone.View.extend( {
	
	tagName: 'li',
	
	template: _.template( $('#item-view').html() ),
	
	events: {
		'click label': 'showMenu',
		'click .editbtn': 'edit',
		'keypress .edit': 'enterEdit',
		'click .destroy': 'clearOne',
		'blur .edit': 'leave',
	},
	
	initialize: function() {
		this.$edit = $('.editbtn');
		this.$deletion = $('.destroy');
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	
	render: function() {
		this.$el.html( this.template ( this.model.attributes ));
		this.$edits = this.$('.edit');
		this.$edit.hide();
		this.$deletion.hide();
		return this;
	},
	
	showMenu: function() {
		this.model.$edit.show();
		this.model.$deletion.show();
	},
	
	edit: function() {
		this.$el.addClass('editing');
		this.$edits.show();
		this.$edits.focus();
	},
	
	enterEdit:function(e) {
		if (e.which === ENTER_KEY ) {
			this.leave();
		}
	},
	
	clearOne: function() {
		this.model.destroy();
	},
	
	leave: function() {
		var value = this.$edits.val().trim();
		
		if (value) {
			this.model.save({ title: value });
		}
		
		else { 
			this.clearOne();
		}
	  		this.$el.removeClass('editing');
				this.$edits.hide();
	},
		
});