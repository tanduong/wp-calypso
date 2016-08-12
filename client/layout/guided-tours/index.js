/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { tracks } from 'lib/analytics';
import AllTours from 'layout/guided-tours/config';
import QueryPreferences from 'components/data/query-preferences';
import RootChild from 'components/root-child';
import { getGuidedTourState } from 'state/ui/guided-tours/selectors';
import { nextGuidedTourStep, quitGuidedTour } from 'state/ui/guided-tours/actions';

class GuidedTours extends Component {
	constructor() {
		super();
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.tourState !== nextProps.tourState;
	}

	next = ( { tour, tourVersion, nextStepName, doNotTrack = false } ) => {
		console.log( tour, tourVersion, nextStepName, doNotTrack );
		if ( ! doNotTrack ) {
			tracks.recordEvent( 'calypso_guided_tours_next', {
				tour,
				step: nextStepName,
				tour_version: tourVersion,
			} );
		}

		this.props.nextGuidedTourStep( {
			stepName: nextStepName,
			tour: tour,
		} );
	}

	quit = ( { step, tour, tourVersion, isLastStep } ) => {
		tracks.recordEvent( `calypso_guided_tours_${ isLastStep ? 'finished' : 'quit' }`, {
			step,
			tour,
			tour_version: tourVersion,
		} );

		this.props.quitGuidedTour( {
			tour,
			stepName: this.props.tourState.stepName,
			finished: isLastStep,
		} );
	}

	render() {
		const {
			tour: tourName,
			stepName = 'init',
			shouldShow
		} = this.props.tourState;

		if ( ! shouldShow ) {
			return null;
		}

		return (
			<RootChild>
				<div className="guided-tours">
					<QueryPreferences />
					<AllTours
							tourName={ tourName }
							stepName={ stepName }
							isValid={ this.props.isValid }
							next={ this.next }
							quit={ this.quit } />
				</div>
			</RootChild>
		);
	}
}

export default connect( ( state ) => ( {
	tourState: getGuidedTourState( state ),
	isValid: ( when ) => !! when( state ),
} ), {
	nextGuidedTourStep,
	quitGuidedTour,
} )( localize( GuidedTours ) );
