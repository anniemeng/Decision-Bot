var app = app || {};

var optionsList = Backbone.Collection.extend({
	
	model: app.option,
	
	localStorage: new Backbone.LocalStorage('decision-backbone'),

	
});

app.opts = new optionsList();