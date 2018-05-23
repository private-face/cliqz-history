import Ember from 'ember';
import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';

function getQuery(url) {
  try {
    const details = new URL(url);
    const searchParams = new URLSearchParams(details.search);
    const queries = searchParams.getAll('q');
    return queries[queries.length-1];
  } catch (e) {
    return '';
  }
}

function normalize(url) {
  // remove protocol, "www." and trailing "/"
  const SCHEME_WWW_RE = /^([a-z0-9]+:([/]+)?)?(www\.)?/i;
  const TRAILING_SLASH_RE = /^([^/]+)\/$/g;
  return url
    .replace(SCHEME_WWW_RE, '')
    .replace(TRAILING_SLASH_RE, '$1');
}

function isURLShortener(url) {
  return !!url.match(SHORTENERS_RE);
}

function worthShowing(visit) {
  return visit.get('title').trim() !== '' &&
         !isURLShortener(visit.get('url'));
}

function lookAlike(visit1, visit2) {
  let url1 = normalize(visit1.get('url'));
  let url2 = normalize(visit2.get('url'));
  let keyword1 = normalize(getQuery(visit1.get('url')) || '');

  return url1 === url2 || visit1.get('isCliqz') && keyword1 === url2;
}

export default DS.Model.extend({

  visits: hasMany('history-message'),

  visitsSorting: ['lastVisitedAt:asc'],

  sortedVisits: Ember.computed.sort('visits', 'visitsSorting'),

  firstVisit: Ember.computed.alias('sortedVisits.firstObject'),
  lastVisit: Ember.computed.alias('sortedVisits.lastObject'),

  isEmpty: Ember.computed('visits', 'firstVisit.isCliqz', function() {
    return this.get('visits.length') === 0 ||
      (this.get('visits.length') === 1 && this.get('firstVisit.isCliqz'));
  }),

  logo: Ember.computed.alias('firstVisit.contact.logo'),

  domain: Ember.computed.alias('firstVisit.contact.domain'),

  lastVisitedAt: Ember.computed.alias('lastVisit.lastVisitedAt'),

  clusters: Ember.computed('visits', function() {
    let lastNumberOfClusters = 0;

    // start with a list of clusters consisting of single visits...
    let clusters = this.get('visits').map(visit => [visit]);

    // ...and keep merging them until nothing can be merged anymore.
    while (lastNumberOfClusters !== clusters.length) {
      lastNumberOfClusters = clusters.length;

      clusters = clusters.reduce((newClusters, nextCluster) => {
        if (newClusters.length === 0) {
          newClusters.push(nextCluster);
          return newClusters;
        }

        const prevCluster = newClusters[newClusters.length - 1];
        const prevHead = prevCluster[prevCluster.length - 1];
        const nextHead = nextCluster[nextCluster.length - 1];
        if (!worthShowing(prevHead) || lookAlike(prevHead, nextHead)) {
          // clusters seem to be similar, merge them into one
          prevCluster.push(...nextCluster);
        } else {
          // nextCluster seems to be independent, push it to the list
          newClusters.push(nextCluster);
        }
        return newClusters;
      }, []);
    }

    // mark clusters' heads
    clusters.forEach(cluster => cluster[cluster.length - 1].set('isMain', true));

    return clusters;
  }),

});


const SHORTENERS = [
  "amp.gs",
  "bit.do",
  "t.co",
  "lnkd.in",
  "db.tt",
  "qr.ae",
  "adf.ly",
  "goo.gl",
  "bitly.com",
  "cur.lv",
  "tinyurl.com",
  "ow.ly",
  "bit.ly",
  "ity.im",
  "q.gs",
  "is.gd",
  "po.st",
  "bc.vc",
  "twitthis.com",
  "u.to",
  "j.mp",
  "buzurl.com",
  "cutt.us",
  "u.bb",
  "yourls.org",
  "x.co",
  "prettylinkpro.com",
  "scrnch.me",
  "filoops.info",
  "vzturl.com",
  "qr.net",
  "1url.com",
  "tweez.me",
  "v.gd",
  "tr.im",
  "link.zip.net",
  "tinyarrows.com",
  "youtu.be",
].map(s => `(${s})`).join('|').replace(/\./g, '\\.');

const SHORTENERS_RE = new RegExp(`^([a-z0-9]+:[/]*)?(${SHORTENERS})\\/[^/?#]+$`, 'gi');
