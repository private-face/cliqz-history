import moment from 'moment';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';

export default Controller.extend({
  queryParams: ['query', 'from', 'to'],

  timestamps: computed(function () {
    const now = moment();
    const yesterday = moment().subtract(1, 'day');
    const lastWeek = moment().subtract(1, 'week');

    return EmberObject.create({
      today: {
        from: now.startOf('day').valueOf() * 1000,
        to: now.endOf('day').valueOf() * 1000,
      },
      yesterday: {
        from: yesterday.startOf('day').valueOf() * 1000,
        to: yesterday.endOf('day').valueOf() * 1000,
      },
      lastWeek: {
        from: lastWeek.startOf('day').valueOf() * 1000,
        to: now.endOf('day').valueOf() * 1000,
      },
    });
  }),
});
