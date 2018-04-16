import React, { Component } from 'react';
import { container, heading, noMargin, image } from './styles';
import RenderLifecycle from './images/RenderLifecycle.jpg';

const Fragment = React.Fragment;

class GetDerivedStateFromProps extends Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    console.log(nextProps, prevState);
    return null;
  }

  state = {};

  render () {
    return <div />;
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

  state = {};

  toggleProps () {
    this.setState(state => ({ ...state }));
  }

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Lifecycle Methods</h2>
        <ul className={noMargin}>
          <li>
            The lifecycle methods, componentWillMount, componentWillReceiveProps
            and componentWillUpdate are being deprecated in a future release of
            React 16 to be completely removed in React 17
          </li>
          <li>
            React 16.3 introduces aliases to these methods using the UNSAFE_
            prefix
          </li>
          <ul>
            <li>
              These <strong>WILL</strong> continue to work in React 17
            </li>
          </ul>
          <li>
            componentWillMount and componentWillUpdate are mostly unneccesary
            anyway as all of the work that is done using them can be done with
            componentDidMount and componentDidUpdate but with fiber's new
            scheduling priority system the 'will' methods aren't guaranteed to
            only run once
          </li>
        </ul>
        <div className={container}>
          <img
            className={image}
            style={{ marginTop: '25px' }}
            src={RenderLifecycle}
            alt=""
          />
        </div>
        <h3>getDerivedStateFromProps</h3>
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
          <GetDerivedStateFromProps {...this.state} />
          <button onClick={this.toggleProps}>Toggle Props</button>
        </div>
        <h3>getSnapshotBeforeUpdate</h3>
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
              componentDidUpdate, which is called immediately after DOM
              mutations
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
