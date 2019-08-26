import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';
import { sort } from '@ember/object/computed';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default DS.Model.extend({

  visits: hasMany('history-message'),

  visitsSorting: ['lastVisitedAt:asc'],

  sortedVisits: sort('visits', 'visitsSorting'),

  firstVisit: alias('sortedVisits.firstObject'),
  lastVisit: alias('sortedVisits.lastObject'),

  isEmpty: computed('visits', 'firstVisit.isCliqz', function() {
    return this.get('visits.length') === 0 ||
      (this.get('visits.length') === 1 && this.get('firstVisit.isCliqz'));
  }),

  logo: alias('firstVisit.contact.logo'),

  domain: alias('firstVisit.contact.domain'),

  lastVisitedAt: alias('lastVisit.lastVisitedAt'),


});
