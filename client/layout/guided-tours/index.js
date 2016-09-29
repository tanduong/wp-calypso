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

	next = ( { tour, tourVersion, nextStepName, skipping = false } ) => {
		// Don't immediately record the transition to the next step. Instead,
		// remember the name of the step and _maybe_ record it later (at the
		// next invokation of `next` or `quit`), depending on whether the step
		// was skipped (see Step#skipIfInvalidContext).
		if ( ! skipping && this.currentStepName ) {
			tracks.recordEvent( 'calypso_guided_tours_next', {
				tour,
				step: this.currentStepName,
				tour_version: tourVersion,
			} );
		}

		this.currentStepName = nextStepName;

		this.props.nextGuidedTourStep( {
			stepName: nextStepName,
			tour: tour,
		} );
	}

	quit = ( { step, tour, tourVersion, isLastStep } ) => {
		if ( this.currentStepName ) {
			tracks.recordEvent( 'calypso_guided_tours_next', {
				tour,
				step: this.currentStepName,
				tour_version: tourVersion,
			} );
			this.currentStepName = null;
		}

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
