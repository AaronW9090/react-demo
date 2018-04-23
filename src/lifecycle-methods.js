import React, { Component, Fragment } from 'react';
import { container, heading, image } from './styles';
import RenderLifecycle from './images/RenderLifecycle.jpg';

class GetDerivedStateFromProps extends Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.firstName !== prevState.firstName) {
      return {
        firstName: nextProps.firstName,
        uppercaseName: nextProps.firstName.toUpperCase()
      };
    }
    return null;
  }

  constructor (props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      uppercaseName: this.props.firstName.toUpperCase()
    };
  }

  state = {
    firstName: '',
    uppercaseName: ''
  };

  render () {
    return (
      <div>
        <p>
          Name: <span style={{ color: 'crimson' }}>{this.props.firstName}</span>
        </p>
        <p>
          Uppercase Name:{' '}
          <span style={{ color: 'crimson' }}>{this.state.uppercaseName}</span>
        </p>
      </div>
    );
  }
}

class GetSnapshotBeforeUpdate extends Component {
  getSnapshotBeforeUpdate (prevProps, prevState) {}

  componentDidUpdate (prevProps, prevState, snapshot) {}

  render () {
    return <div />;
  }
}

class LifecycleMethods extends Component {
  static displayName = 'LifecycleMethodsExample';

  state = {
    firstName: ''
  };

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Lifecycle Methods</h2>
        <h3 className={heading}>What</h3>
        <div className={container}>
          <p>
            The lifecycle methods, componentWillMount, componentWillReceiveProps
            and componentWillUpdate are being deprecated in a future release of
            React 16 to be completely removed in React 17
          </p>
          <p>
            React 16.3 introduces aliases to these methods using the UNSAFE_
            prefix. These <strong>WILL</strong> continue to work in React 17
          </p>
          <p>
            As a replacement for these methods React 16.3 introduces the
            getDerivedStateFromProps and getSnapshotBeforeUpdate lifecycle
            methods.
          </p>
          <p>
            <a href="https://github.com/reactjs/reactjs.org/issues/721">This</a>{' '}
            is a good discussion on how and why these lifecycle methods were
            introduced
          </p>
        </div>
        <img
          className={image}
          style={{ marginBottom: '30px' }}
          src={RenderLifecycle}
          alt=""
        />
        <h3 className={heading}>Why</h3>
        <div className={container}>
          <p>
            With the current API it is too easy to block the initial render with
            inessential logic. The componentWill* lifecycle methods were fairly
            unclear in their purpose, had some major performance implications if
            they were misused and, for the most part, the problem that was being
            solved could have used one of the componentDid* lifecycle methods.
          </p>
          <p>
            The Fiber architecture also doesn't play well with these methods
            because to be able to pause, abort and restart updates, the
            componentWill* lifecycle methods aren't guaranteed to only be run
            once.
          </p>
        </div>
        <h3 className={heading}>How</h3>
        <h4>getDerivedStateFromProps (nextProps, prevState)</h4>
        <div className={container}>
          <ul>
            <li>
              This static method is called on component instantiation as well as
              when it receives new props (does not mean the props are guaranteed
              to have changed)
            </li>
            <li>
              Returns an object to update state, or null to indicate no state
              change is required
            </li>
            <li>
              Because it is not an instance method it does not have access to
              this
            </li>
            <ul>
              <li>
                This was done on purpose to minimize the risk of people writing
                code with side-effects in this method
              </li>
              <li>
                It also means that the props that would normally be checked in
                componentWillReceiveProps will have to be saved into state so
                that they can be checked against nextProps
              </li>
            </ul>
            <li>
              To do everything that componentWillReceiveProps did it may have to
              be combined with componentDidUpdate
            </li>
            <li>
              If you define getDerivedStateFromProps and
              componentWillReceiveProps on the same class then only
              getDerivedStateFromProps will be called
            </li>
          </ul>
          <GetDerivedStateFromProps firstName={this.state.firstName} />
          <input
            style={{ color: '#1e1f20' }}
            type="text"
            value={this.state.firstName}
            onChange={e => {
              e.persist();
              this.setState(state => ({ ...state, firstName: e.target.value }));
            }}
          />
        </div>
        <h4>getSnapshotBeforeUpdate (prevProps, prevState)</h4>
        <div className={container}>
          <ul>
            <li>
              With async rendering there may be a delay between render phase
              lifecycles (componentWillUpdate) and commit phase lifecycles
              (componentDidUpdate)
            </li>
            <li>
              If the user does something (like resize the browser window) during
              that delay any DOM properties that were read in the render phase
              lifecycles could be stale
            </li>
            <li>
              The lifecycle method getSnapshotBeforeUpdate will be called
              <strong>
                <i> immediately before </i>
              </strong>
              DOM mutations are made
            </li>
            <li>
              It's return value is then passed as the third parameter to
              componentDidUpdate, which is called
              <strong>
                <i> immediately after </i>
              </strong>
              DOM mutations
            </li>
            <li>
              This method is intended to only be used with componentDidUpdate,
              there will even be a warning thrown if you define this method
              without a componentDidUpdate counterpart
            </li>
          </ul>
          <GetSnapshotBeforeUpdate />
        </div>
      </Fragment>
    );
  }
}

export default LifecycleMethods;
