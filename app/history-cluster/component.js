import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['cluster'],
  history: Ember.inject.service('history-sync'),

  mainVisit: Ember.computed('visits', function() {
    return this.get('visits').filter(visit => visit.get('isMain'))[0];
  }),

  isSingleVisit: Ember.computed.equal('visits.length', 1),

  actions: {
    deleteCluster: function () {
      const clusterIds = this.get('visits').mapBy('id');
      this.get('history').deleteVisits(clusterIds);
    }
  }
});