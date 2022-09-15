import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from './miscIpfsFunctions.js'

export const ipfsPubsubPeers = (topic) => {
    const peerIds = await MiscIpfsFunctions.ipfs.pubsub.peers(topic);
	return peerIds;
}

export const ipfsPubsubSubscribe = (topic) => {
    const peerIds = await MiscIpfsFunctions.ipfs.pubsub.subscribe(topic);
	return peerIds;
}
