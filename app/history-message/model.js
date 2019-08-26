import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Model.extend({
  url: attr(),
  title: attr(),
  query: attr(),
  isActive: attr(),
  isCurrent: attr(),
  tabIndex: attr(),
  lastVisitedAt: attr(),
  meta: attr(),
  isCliqz: computed("url", function() {
    return this.getWithDefault('url', '').indexOf('https://cliqz.com/search?q=') === 0;
  }),

  contact: belongsTo('history-contact'),
  session: belongsTo('session'),

  shortUrl: computed("url", function () {
    const url = this.get("url");
    const reUrlPath = /(^http.?:\/\/)(.*?)([/\\\\?]{1,})(.*)/;
    return (url.match(reUrlPath) || []).pop() || "/";
  }),

  smartTitle: computed("title", "meta.ogTitle", "meta.title", function () {
    return this.get("meta.ogTitle") || this.get("meta.title") || this.get("title");
  }),

  description: computed("meta.ogDescription", "meta.description", function () {
    return this.get("meta.ogDescription") || this.get("meta.description");
  }),

  image: alias("meta.ogImage")
});
