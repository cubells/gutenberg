/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import withInstanceId from '../higher-order/with-instance-id';

class Fill extends Component {
	componentDidMount() {
		const { registerFill = noop } = this.context;

		registerFill( this.props.name, this );
	}

	componentWillUnmount() {
		const { unregisterFill = noop } = this.context;

		unregisterFill( this.props.name, this );
	}

	componentWillReceiveProps( nextProps ) {
		const { name } = nextProps;
		const {
			unregisterFill = noop,
			registerFill = noop,
		} = this.context;

		if ( this.props.name !== name ) {
			unregisterFill( this.props.name, this );
			registerFill( name, this );
		}
	}

	componentDidUpdate() {
		const { getSlot = noop } = this.context;
		const slot = getSlot( this.props.name );
		if ( slot && ! slot.props.bubblesVirtually ) {
			slot.forceUpdate();
		}
	}

	render() {
		const { getSlot = noop } = this.context;
		const { name, children } = this.props;
		const slot = getSlot( name );
		if ( ! slot || ! slot.props.bubblesVirtually ) {
			return null;
		}

		return createPortal( children, slot.node );
	}
}

Fill.contextTypes = {
	getSlot: noop,
	registerFill: noop,
	unregisterFill: noop,
};

export default withInstanceId( Fill );
