var app = app || {};

app.viewResult = Backbone.View.extend( {
	
	el: '#submitting',
	
	resultTemplate: _.template( $('#result-disp').html() ),
	
	events: {
	},
	
	initialize: function() {
		this.$radio = this.$('input[name=result]:checked');
		this.$disp = this.$('#disp');
		Backbone.on('getResult', this.render, this);
		},
	
	render: function() {
		var resultChoice = this.$radio.val();
		
		if (resultChoice === "single") {
			var random = Math.floor(Math.random() * app.opts.length);	
			var chosen = app.opts.at(random).get("title");
			this.$el.html(this.resultTemplate( {
				resultTxt: chosen
			}));
		}
		
		else if (resultChoice === "order") {
			
		}
	}
	
});

