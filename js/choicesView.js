var app = app || {};

app.viewChoices = Backbone.View.extend( {
	el: '#inputting',
	
	choiceTemplate: _.template( $('#display-choices').html() ),
	resultTemplate: _.template( $('#result-disp').html() ),
	
	events: {
		'click #clear-all': 'clear',
		'keypress #new-option': 'enterCreate',
		'click .send': 'result',
		'click .restart': 'refresh'
	},
	
	initialize: function() {
		this.bool = false;
		this.$added = this.$('#new-option');
		this.$choices = this.$('#choices');	
		this.$submit = this.$('#submitting');
		this.$radio = this.$('input[name=result]:checked');
		this.$disp = this.$('#disp');
		this.$list = this.$('#list');
		this.listenTo(app.opts, 'add', this.addOpt);
		this.listenTo(app.opts, 'reset', this.addOpts);
		this.listenTo(app.opts, 'all', this.render);
		app.opts.fetch();
	},
	
	render: function () {
		var total = app.opts.length;
		if ((total > 0)&& (!this.bool)) {
			this.$choices.show();
			this.$submit.show();
			
			this.$choices.html(this.choiceTemplate( {
				total: total
			}));
		}
		
		else if ((total > 0) && this.bool) {
			var resultChoice = this.$radio.val();
			if (resultChoice === "single") {
				var random = Math.floor(Math.random() * app.opts.length);	
				var chosen = app.opts.at(random).get("title");
				this.$disp.html(this.resultTemplate( {
					resultTxt: chosen
				}));	
				this.$choices.hide();
				this.$submit.hide();
				this.$added.hide();
				this.$list.hide();
			}
			
			else if (resultChoice === "order") {
				
			}
		}

		else {
			this.$added.show();
			this.$choices.hide();
			this.$submit.hide();
			this.$list.show();
		}
	},
	
	clear: function() {
		while(app.opts.length) { 
    	app.opts.at(0).destroy(); 
		}
		return false;
	},
	
	createTitle: function() {
		return {
			title: this.$added.val().trim()
		};
	},
	
	enterCreate: function() {
		if (event.which !== ENTER_KEY || !this.$added.val().trim() ) {
			return;
		}
		
		app.opts.create( this.createTitle() );
		this.$added.val('');
	}, 
	
	addOpt: function( newOpt ) {
		var view = new app.viewOptions({ model: newOpt});
		$('#options-list').append( view.render().el );
	},
	
	addOpts: function() {
		this.$('#options-list').html('');
		app.opts.each(this.addOpt, this);
	},
	
	result: function() {
		this.bool= true;
		this.render();
	},
	
	refresh: function() {
		this.bool = false;
		this.clear();
		this.$disp.html(null);
		this.render();
	}

});



