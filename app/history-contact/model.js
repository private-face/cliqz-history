import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { filterBy } from '@ember/object/computed';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Model.extend({
  domain: attr(),
  logo: attr(),
  lastVisitedAt: attr(),
  isCurrent: attr(),
  isActive: attr(),
  tabIndex: attr(),
  snippet: attr(),

  messages: hasMany('history-message'),
  news: hasMany('cliqz-article'),

  rootMessages: filterBy("messages", "shortUrl", "/"),
  rootMessage: alias("rootMessages.firstObject"),

  // TODO: move to component
  title: computed("snippet.og.title", "snippet.title", function () {
    return this.get("snippet.og.title") || this.get("snippet.title");
  }),

  // TODO: move to component
  description: computed("snippet.og.description", "snippet.desc", function () {
    return this.get("snippet.og.description") || this.get("snippet.desc");
  }),

  image: computed("snippet.og.image", "rootMessage.image", function () {
    return this.get("snippet.og.image") || this.get("rootMessage.image");
  }),
});
