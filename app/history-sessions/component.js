import Component from '@ember/component';
import { sort } from '@ember/object/computed';
import { filterBy } from '@ember/object/computed';
import { once } from '@ember/runloop';

export default Component.extend({
  tagName: 'ul',
  classNames: ['session-list'],

  sessionsSorting: ['lastVisitedAt:desc'],
  sortedSessions: sort('model', 'sessionsSorting'),
  sessions: filterBy('sortedSessions', 'isDeleted', false),

  setScrollEvent: function () {
    this.__scroll = this.scroll.bind(this);
    this.$().on('scroll', this.__scroll);
  }.on('didInsertElement'),

  unsetScrollEvent: function () {
    this.$().off('scroll', this.__scroll);
  }.on('willDestroyElement'),

  scroll: function () {
    if ((this.element.scrollTop + 200) >= this.element.scrollTopMax) {
      once(this, this.loadMore);
    }
  },

  autoLoadMore: function () {
    if (this.get('model.hasMoreResults') && (this.element.scrollTopMax === 0)) {
      once(this, this.loadMore);
    }
  }.observes('model.content.length', 'model.hasMoreResults'),

  loadMore() {
    this.get('model').loadMore();
  },

  actions: {
    loadMore() {
      this.loadMore();
    }
  },
});
