import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

import SystemProcessingStore from 'stores/system-processing/SystemProcessingStore';
import SystemLoadBalancerStore from 'stores/load-balancer/SystemLoadBalancerStore';

const ClusterOverviewStore = Reflux.createStore({
  sourceUrl: '/cluster',
  clusterOverview: undefined,

  init() {
    this.cluster();
    this.listenTo(SystemProcessingStore, this.cluster);
    this.listenTo(SystemLoadBalancerStore, this.cluster);
  },

  getInitialState() {
    return {clusterOverview: this.clusterOverview};
  },

  cluster() {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl));
    promise.then(
      (response) => {
        this.clusterOverview = response;
        this.trigger({clusterOverview: this.clusterOverview});
      },
      (error) => UserNotification.error(`Getting cluster overview failed: ${error}`, 'Could not get cluster overview')
    );

    return promise;
  },

  jvm(nodeId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(`${this.sourceUrl}/${nodeId}/jvm`));
    promise.catch(error => UserNotification.error(`Getting JVM information for node '${nodeId}' failed: ${error}`, 'Could not get JVM information'));

    return promise;
  },
});

export default ClusterOverviewStore;
