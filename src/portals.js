import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { connect } from './context';
import { container, heading, image } from './styles';
import PortalImage from './images/Portal.png';

const overlay = css`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
`;

const modal = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 200px;
  width: 400px;
  background: #eee;
  color: #1e1f20;
  font-size: 24px;
  border-radius: 5px;
`;

class EventPropagationPortal extends Component {
  constructor (props) {
    super(props);
    this.containerEl = document.createElement('div');
    this.containerEl.className = overlay;
  }

  // This appends the node after the portaled content has been rendered
  // If the node you are portalling needs to be measured then it's a good idea
  // to have the container node ready to go before the component is created
  componentDidMount () {
    document.body.appendChild(this.containerEl);
  }

  componentWillUnmount () {
    document.body.removeChild(this.containerEl);
  }

  render () {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class WindowPortal extends Component {
  constructor (props) {
    super(props);
    this.externalWindow = null;
    this.containerEl = document.createElement('div');
  }

  componentDidMount () {
    this.externalWindow = window.open(
      '',
      '',
      'width=600,height=400,left=600,top=400'
    );
    const styles = document.createElement('style');
    styles.appendChild(
      document.createTextNode(`
        * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #eee;
        }

        body {
          background: #1e1f20;
        }

        button {
          background-color: crimson;
          width: 80px;
          height: 30px;
        }
      `)
    );
    this.externalWindow.document.head.appendChild(styles);
    this.externalWindow.document.body.appendChild(this.containerEl);
    this.externalWindow.addEventListener(
      'beforeunload',
      this.props.closeWindowPortal
    );
  }

  componentWillUnmount () {
    this.externalWindow.close();
  }

  render () {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class Portals extends Component {
  static displayName = 'PortalsExample';

  constructor (props) {
    super(props);
    this.state = {
      windowPortalOpen: false
    };
    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.toggleEventPortal = this.toggleEventPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
  }

  toggleWindowPortal () {
    this.setState(state => ({
      ...state,
      windowPortalOpen: !state.windowPortalOpen
    }));
  }

  toggleEventPortal () {
    this.setState(state => ({
      ...state,
      eventPortalOpen: !state.eventPortalOpen
    }));
  }

  closeWindowPortal () {
    this.setState(state => ({ ...state, windowPortalOpen: false }));
  }

  incrementCount () {
    const {
      actions: { increment }
    } = this.props;
    increment();
  }

  render () {
    const { windowPortalOpen, eventPortalOpen } = this.state;
    const { counter } = this.props;
    return (
      <Fragment>
        <h2 className={heading}>Portals</h2>
        <h3 className={heading}>What</h3>
        <div className={container}>
          <p>
            Portals are a way to render content to an arbitrary DOM node,
            outside of where it would normally be rendered in the react tree.
          </p>
          <p>
            This can be useful for elements like Modal or Toast where you would
            like to pass some props from the parent component to the child Modal
            component but don't want the parents styling to have any affect over
            the Modal whatsoever.
          </p>
          <p>
            The portaled child acts exactly like it would in every other way, as
            it is still in the exact same position in the react tree. This means
            that things like context and event bubbling will work in the exact
            same way as if the component were not portaled.
          </p>
        </div>
        <h3 className={heading}>Why</h3>
        <div className={container}>
          <p>
            Creating portals in React 15 and below was possible and could be
            done by rendering out null in render() but using ReactDOM.render()
            in componentDidMount and re-rendering manually when the component
            updates. However this approach was ugly and error prone, and could
            lead to some confusing bugs because event bubbling and context
            doesn't work as expected just by looking at a component with a
            portaled child.
          </p>
        </div>
        <h3 className={heading}>How</h3>
        <div className={container}>
          <img className={image} src={PortalImage} alt="" />
        </div>
        <h3>Window Portal</h3>
        <div className={container}>
          {windowPortalOpen && (
            <WindowPortal closeWindowPortal={this.closeWindowPortal}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '90vh',
                  width: '100vw',
                  fontSize: '24px'
                }}
              >
                {counter}
              </div>
            </WindowPortal>
          )}
          <button
            style={{ width: '150px' }}
            onClick={this.toggleWindowPortal}
          >{`${
              windowPortalOpen ? 'Close window' : 'Open window'
            } portal`}</button>
          <button onClick={this.incrementCount}>Increment</button>
        </div>
        <h3>Event Propagation Portal</h3>
        <div className={container}>
          <button
            style={{ width: '150px' }}
            onClick={this.toggleEventPortal}
          >{`${eventPortalOpen ? 'Close event' : 'Open event'} portal`}</button>
          <button onClick={this.incrementCount}>
            {eventPortalOpen && (
              <EventPropagationPortal>
                <div className={modal}>
                  {counter}
                  <button onClick={this.toggleEventPortal}>Close portal</button>
                </div>
              </EventPropagationPortal>
            )}
            Increment
          </button>
        </div>
      </Fragment>
    );
  }
}

const mapCountToProps = function (state) {
  return {
    counter: state.counter
  };
};

const connectedPortals = connect(mapCountToProps)(Portals);
connectedPortals.displayName = 'PortalsExample';

export default connectedPortals;
