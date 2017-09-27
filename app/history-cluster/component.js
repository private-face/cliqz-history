import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'article',
	classNames: ['cluster'],

	setup: function() {
		this.set('collapsed', !this.get('isSingleVisit'));
	}.on('init'),

	isSingleVisit: Ember.computed.equal('visits.length', 1),

	actions: {
		toggleCollapsedState: function() {
			this.set('collapsed', !this.get('collapsed'));
		}
	}
});