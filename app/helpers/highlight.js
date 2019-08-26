import Ember from 'ember';
import { htmlSafe } from '@ember/template';
import { helper as buildHelper } from '@ember/component/helper';

function toRegexp(text) {
  const escapedText = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  return new RegExp(escapedText, 'gi');
}

export function highlight([text, em]) {
  if (!em) {
    return text;
  }

  var safeText = Ember.Handlebars.Utils.escapeExpression(text || '');
  const re = toRegexp(em);
  const highlighted = safeText.replace(re, function (match) {
    return `<em>${match}</em>`;
  });
  return htmlSafe(highlighted);
}

export default buildHelper(highlight);
