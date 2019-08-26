import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  classNames: ['logo'],

  attributeBindings: ['style', 'extra'],

  style: computed('model.style', function () {
    const style = this.get('model.style');
    return htmlSafe(style);
  }),

  extra: 'logo',
});
