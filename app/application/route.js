/* global chrome */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { Promise } from 'rsvp';

function waitForChrome(callback) {
  if (typeof chrome !== 'object') {
    setTimeout(() => waitForChrome(callback), 50);
  } else {
    callback(chrome);
  }
}

export default Route.extend({
  moment: inject('moment'),
  i18n: inject('i18n'),
  beforeModel() {
    return new Promise((resolve) => {
      waitForChrome((chrome) => {
        const i18n = this.get('i18n');
        const moment = this.get('moment');
        const lang = chrome.i18n.getMessage('lang_code') || 'en';
        i18n.set('locale', lang);
        moment.setLocale(lang);
        document.title = i18n.t('history.tab-title');
        resolve();
      });
    });
  }
});

