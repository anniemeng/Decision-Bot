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
		this.count = 0;
		this.$image = this.$('#icon');
		this.$added = this.$('#new-option');
		this.$choices = this.$('#choices');	
		this.$submit = this.$('#submitting');
		this.$disp = this.$('#disp');
		this.$list = this.$('.list');
		this.listenTo(app.opts, 'add', this.addOpt);
		this.listenTo(app.opts, 'reset', this.addOpts);
		this.listenTo(app.opts, 'all', this.render);
		Backbone.on("subCount", this.subCount, this);
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
			//hide everything else
			this.$choices.hide();
			this.$submit.hide();
			this.$added.hide();
			this.$list.hide();			
			
			//change to happy img 
			this.$image.attr('src',"http://www.smilys.net/riesige_smilies/smiley5102.gif");
			
			//get random choice
			var resultChoice = $('input[name=result]:checked').val();
			console.log(resultChoice);
			
			//single output
			if (resultChoice === "single") {
				var random = Math.floor(Math.random() * app.opts.length);	
				var chosen = app.opts.at(random).get("title");
				this.$disp.html(this.resultTemplate( {
					resultTxt: chosen
				}));	
			}
			
			//ordered output
			else if (resultChoice === "order") {
				var shuffled = _.shuffle(app.opts.toArray());
				var chosen = "<br>";
				for (var i = 0; i < shuffled.length; i++) {
					chosen = chosen + (i+1) + ". " + shuffled[i].get("title") + "<br>";
				}
				this.$disp.html(this.resultTemplate( {
					resultTxt: chosen
				}));	
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
		//change back to original img
		this.count=0;
		this.$image.attr('src',"http://www.clker.com/cliparts/e/8/3/a/11949864601483835659smiley103.svg.med.png");
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
	
	changeImg: function() {
		//original
		if (this.count===0) {
			this.$image.attr('src',"http://www.clker.com/cliparts/e/8/3/a/11949864601483835659smiley103.svg.med.png");
		}
		
		else if (this.count % 2 === 0) {
			this.$image.attr('src',"http://upload.wikimedia.org/wikipedia/en/f/f5/Question_mark.PNG");
		}
		
		else if (this.count % 2 === 1) {
			this.$image.attr('src',"http://www.clipartbest.com/cliparts/4ib/A64/4ibA64big.png");
		}
	},
	
	subCount: function() {
		this.count--;
		this.changeImg();
	},
	
	addOpt: function( newOpt ) {
		var view = new app.viewOptions({ model: newOpt});
		//change image
		this.count++;
		this.changeImg();
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



