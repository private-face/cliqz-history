import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  tagName: 'article',
  classNames: ['cluster'],
  cliqz: inject('cliqz'),

  mainVisit: computed('visits', function() {
    return this.get('visits').filter(visit => visit.get('isMain'))[0];
  }),

  isSingleVisit: computed.equal('visits.length', 1),

  actions: {
    deleteCluster: function () {
      const clusterIds = this.get('visits').mapBy('id');
      this.get('cliqz').deleteVisits(clusterIds);
    }
  }
});