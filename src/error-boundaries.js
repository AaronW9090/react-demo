import React, { Component, Fragment } from 'react';
import { css } from 'emotion';
import { container, heading, image } from './styles';
import ErrorBoundaryHOCImage from './images/ErrorBoundaryHOC.png';
import ErrorBoundaryHOEImage from './images/ErrorBoundaryHOE.png';

const error = css`
  padding: 30px;
  background-color: crimson;
  text-align: center;
`;

class Error extends Component {
  render () {
    return <div className={error}>{this.props.children}</div>;
  }
}

function withErrorBoundary () {
  return function (WrappedComponent) {
    class ErrorBoundaryHOC extends React.Component {
      state = {
        hasError: false,
        error: null,
        info: null
      };

      componentDidCatch () {
        this.setState(state => ({ ...state, hasError: true }));
      }

      render () {
        const { hasError } = this.state;
        if (hasError) {
          return (
            <Error>
              <img className={image} src={ErrorBoundaryHOCImage} alt="" />
            </Error>
          );
        } else {
          return <WrappedComponent {...this.props} />;
        }
      }
    }

    return ErrorBoundaryHOC;
  };
}

class ErrorBoundaryHOE extends React.Component {
  state = {
    hasError: false,
    error: null,
    info: null
  };

  componentDidCatch () {
    this.setState(state => ({ ...state, hasError: true }));
  }

  render () {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Error>
          <img className={image} src={ErrorBoundaryHOEImage} alt="" />
          <button
            style={{ marginTop: '25px' }}
            onClick={() => {
              this.setState({ hasError: false });
            }}
          >
            Remount Me
          </button>
        </Error>
      );
    } else {
      return this.props.children;
    }
  }
}

class ErrorComponent extends Component {
  state = {
    someState: {}
  };

  constructor (props) {
    super(props);
    this.makeErrorHappen = this.makeErrorHappen.bind(this);
    this.makeUncatchableErrorHappen = this.makeUncatchableErrorHappen.bind(
      this
    );
  }

  makeErrorHappen () {
    this.setState(state => ({
      ...state,
      someState: state.someState.someProperty.undefinedSubProperty
    }));
  }

  makeUncatchableErrorHappen () {
    return this.state.someState.someProperty.undefinedSubProperty;
  }

  render () {
    return (
      <div style={{ display: 'flex' }}>
        <button onClick={this.makeErrorHappen}>Error me!</button>
        <button
          style={{ width: '120px' }}
          onClick={this.makeUncatchableErrorHappen}
        >
          Uncatchable Error
        </button>
      </div>
    );
  }
}

const ErrorComponentHOC = withErrorBoundary()(ErrorComponent);

class ErrorBoundaries extends Component {
  static displayName = 'ErrorBoundariesExample';

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Error Boundaries</h2>
        <h3 className={heading}>What</h3>
        <div className={container}>
          <p>
            If a catchable error is thrown in React 16 it will cause the entire
            component tree to unmount. Error boundaries are a way to deal with
            this.
          </p>
          <p>
            Errors will propagate up the component tree until they reach a
            component that implements the componentDidCatch lifecycle method
          </p>
          <p>
            Not all errors will be caught by componentDidCatch, it is triggered
            by
          </p>
          <ul>
            <li>Errors in render function of class components</li>
            <li>Errors in functional components</li>
            <li>Errors in constructors</li>
            <li>Errors in lifecycle methods</li>
            <li>Errors in setState (functional version)</li>
          </ul>
          <p>
            componentDidCatch will <strong>NOT</strong> be triggered by errors
            in event listeners unless the error occurs in the functional version
            of setState
          </p>
        </div>
        <h3 className={heading}>Why</h3>
        <div className={container}>
          <p>
            In previous versions of React if an error was thrown while the UI
            was rendering it would still display in a potentially corrupted
            state, leading to bugs and inconsistencies.
          </p>
        </div>
        <h3 className={heading}>How</h3>
        <div className={container}>
          <p>
            By implementing the componentDidCatch lifecycle method a component
            can tell React to render a fallback UI instead of the corrupted one.
          </p>
        </div>
        <h4 className={heading}>Error</h4>
        <div className={container}>
          <p>
            If a componentDidCatch is not found the entire component tree is
            unmounted.
          </p>
          <ErrorComponent />
        </div>
        <h4 className={heading}>Error Boundary Higher Order Element</h4>
        <div className={container}>
          <p>
            While any component can implement componentDidCatch, having an error
            boundary element can make code more understandable.
          </p>
          <ErrorBoundaryHOE>
            <ErrorComponent />
          </ErrorBoundaryHOE>
        </div>
        <h4 className={heading}>Error Boundary Higher Order Component</h4>
        <div className={container}>
          <p>
            However an error boundary HOC can make reusing components with error
            boundaries much simpler
          </p>
          <ErrorComponentHOC />
        </div>
      </Fragment>
    );
  }
}

export default ErrorBoundaries;
