/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import { tracks, mc } from 'lib/analytics';

export default class TrackComponentView extends Component {
	static propTypes = {
		eventName: PropTypes.string,
		eventProperties: PropTypes.object,
		statGroup: PropTypes.string,
		statName: PropTypes.string
	};

	componentWillMount() {
		const { eventName, eventProperties } = this.props;
		if ( eventName ) {
			tracks.recordEvent( eventName, eventProperties );
		}

		const { statGroup, statName } = this.props;
		if ( statGroup ) {
			mc.bumpStat( statGroup, statName );
		}
	}

	render() {
		return null;
	}
}
