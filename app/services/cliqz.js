/* global browser, Proxy */
import Service from '@ember/service';
import { inject } from '@ember/service';

function createActionWrapperForModule(module) {
  const actionHandler = (action, ...args) => browser.runtime.sendMessage({
    module,
    action,
    args,
  });

  // Return a proxy so that people can call `module.actionName(...args)` instead
  // of `module.action('actionName', ...args)`. This is not strictly needed but
  // modules are expecting this API.
  return new Proxy({}, {
    get: (obj, prop) => {
      if (prop === 'action') {
        return actionHandler;
      }

      return actionHandler.bind(obj, prop);
    },
  });
}

export default Service.extend({
  historySync: inject('history-sync'),

  init() {
    this._super(...arguments);

    const historyProxy = createActionWrapperForModule('history');
    this.deleteVisit = historyProxy.deleteVisit;
    this.deleteVisits = historyProxy.deleteVisits;
    this.showHistoryDeletionPopup = historyProxy.showHistoryDeletionPopup;
    this.sendUserFeedback = historyProxy.sendUserFeedback;
    this.getHistory = historyProxy.getHistory;
    this.openNewTab = historyProxy.newTab.bind(historyProxy, true);
    this.getQuery = historyProxy.getQuery;
    this.getQueries = historyProxy.getQueries;
    this.openUrl = historyProxy.openUrl;
    this.selectTabAtIndex = historyProxy.selectTabAtIndex;

    const coreProxy = createActionWrapperForModule('core');
    this.getCliqzStatus = coreProxy.status;
    this.queryCliqz = coreProxy.queryCliqz;
    this.redoQuery = coreProxy.redoQuery;
    this.sendTelemetry = coreProxy.sendTelemetry;
    this.openFeedbackPage = coreProxy.openFeedbackPage;

    browser.runtime.onMessage.addListener((message) => {
      if(message.action === "updateHistoryUrls") {
        const { urls } = message.args[0];
        this.get('historySync').updateHistoryUrls(urls);
      }
    });
  },
});
