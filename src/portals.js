import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { container, heading, noMargin } from './styles';

const Fragment = React.Fragment;

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
  constructor(props) {
    super(props);
    this.containerEl = document.createElement('div');
    this.containerEl.className = overlay;
  }

  componentDidMount() {
    document.body.appendChild(this.containerEl);
  }

  componentWillUnmount() {
    document.body.removeChild(this.containerEl);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class WindowPortal extends Component {
  constructor(props) {
    super(props);
    this.externalWindow = null;
    this.containerEl = document.createElement('div');
  }

  componentDidMount() {
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

  componentWillUnmount() {
    this.externalWindow.close();
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class Portals extends Component {
  static displayName = 'PortalsExample';

  constructor(props) {
    super(props);
    this.state = {
      windowPortalOpen: false,
      count: 0
    };
    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.toggleEventPortal = this.toggleEventPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
  }

  toggleWindowPortal() {
    this.setState(state => ({
      ...state,
      windowPortalOpen: !state.windowPortalOpen
    }));
  }

  toggleEventPortal() {
    this.setState(state => ({
      ...state,
      eventPortalOpen: !state.eventPortalOpen
    }));
  }

  closeWindowPortal() {
    this.setState(state => ({ ...state, windowPortalOpen: false }));
  }

  incrementCount() {
    this.setState(state => ({ ...state, count: state.count + 1 }));
  }

  render() {
    const { windowPortalOpen, eventPortalOpen, count } = this.state;
    return (
      <Fragment>
        <h2 className={heading}>Portals</h2>
        <div className={container}>
          <ul className={noMargin}>
            <li>
              Portals are a way to render content to an arbitrary DOM node,
              outside of where it would normally be rendered in the react tree
            </li>
            <li>
              This can be useful for elements like Modal or Toast where you
              would like to pass some props from the parent component to the
              child Modal component but don't want the parents styling to have
              any affect over the Modal whatsoever
            </li>
            <li>
              What is interesting is that the portaled child acts exactly like
              it would in every other way, as it is still in the exact same
              position in the react tree
            </li>
            <li>
              This means that events will be captured by and bubble up through
              its' parent component
            </li>
            <ul>
              <li>Could lead to some very interesting bugs</li>
              <li>
                a Modal that is triggered from a slidedown row in a Table
                component could very well close the slidedown as you submit the
                form inside the Modal
              </li>
            </ul>
          </ul>
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
                {count}
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
                  {count}
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

export default Portals;
