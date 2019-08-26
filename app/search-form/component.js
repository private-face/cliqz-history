import Component from '@ember/component';
import { inject } from '@ember/service';
import { gt } from '@ember/object/computed';
import { debounce } from '@ember/runloop';

export default Component.extend({
  cliqz: inject(),
  tagName: 'from',
  classNames: ['search'],

  classNameBindings: ['hasQuery:is-active'],

  hasQuery: gt('model.length', 0),

  modelObserver: function() {
    debounce(() => {
      this.set('model', this.get('modelProxy'));
      if(this.get('isReadyToSendTelemetry')) {
        this.actions.sendTelemetry.call(this);
        this.set('isReadyToSendTelemetry', false);
      }
    }, this.get('debounce'));
  }.observes('modelProxy'),

  modelProxy: function(key, value) {
    if (arguments.length > 1) {
      return this._modelProxy = value;
    } else {
      return this.getWithDefault('model', this._modelProxy);
    }
  }.property('model'),

  clear() {
    this.set('modelProxy', '');
  },

  keyUp(e) {
    if (e.key === "Escape") {
      this.clear();
    }
  },

  actions: {
    clearQuery() {
      if (this.get('hasQuery')) {
        this.get('cliqz').sendTelemetry({
          type: 'history',
          view: 'sections',
          action: 'click',
          target: 'clear_search'
        });
      }
      this.clear();
    },
    sendTelemetry() {
      if (this.get('hasQuery')) {
        this.get('cliqz').sendTelemetry({
          type: 'history',
          view: 'sections',
          action: 'search',
          query_length: this.get('model.length')
        });
      }
    },
    sendReadySignal() { // To prevent sending duplicate signals when user types fast
      this.set('isReadyToSendTelemetry', true);
    }
  }
});
