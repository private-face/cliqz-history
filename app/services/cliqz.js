import Ember from 'ember';
import Spanan from 'npm:spanan';

export default Ember.Service.extend({
  historySync: Ember.inject.service('history-sync'),

  init() {
    this._super(...arguments);

    const history = new Spanan(({ uuid, functionName, args }) => {
      const message = JSON.stringify({
        target: 'cliqz',
        module: 'history',
        action: functionName,
        requestId: uuid,
        args,
      });
      window.postMessage(message, '*');
    });
    const historyProxy = history.createProxy();

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

    const core = new Spanan(({ uuid, functionName, args }) => {
      const message = JSON.stringify({
        target: 'cliqz',
        module: 'core',
        action: functionName,
        requestId: uuid,
        args,
      });
      window.postMessage(message, '*');
    });
    const coreProxy = core.createProxy();

    this.getCliqzStatus = coreProxy.status;
    this.queryCliqz = coreProxy.queryCliqz;
    this.redoQuery = coreProxy.redoQuery;
    this.sendTelemetry = coreProxy.sendTelemetry;
    this.openFeedbackPage = coreProxy.openFeedbackPage;


    window.addEventListener("message", ev => {
      let message = {};

      try {
        message = JSON.parse(ev.data);
      } catch (e) {
        // non CLIQZ or invalid message should be ignored
      }

      if(message.action === "updateHistoryUrls") {
        this.get('historySync').updateHistoryUrls(message.message.urls);
      }

      if (message.action === 'deleteSite') {
        this.get('historySync').deleteSite(message.message.topUrl)
      }

      if (message.type === "response") {
        const spananMessage = {
          uuid: message.requestId,
          returnedValue: message.response
        };

        if (core.dispatch(spananMessage)) {
          return;
        }

        if (history.dispatch(spananMessage)) {
          return;
        }
      }
    });
  },

});
