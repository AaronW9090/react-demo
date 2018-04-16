import React, { Component } from 'react';
import { css } from 'emotion';
import { container, heading, noMargin, image } from './styles';
import ErrorBoundaryHOCImage from './images/ErrorBoundaryHOC.png';
import ErrorBoundaryHOEImage from './images/ErrorBoundaryHOE.png';

const Fragment = React.Fragment;

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
  }

  makeErrorHappen () {
    this.setState(state => ({
      ...state,
      someState: state.someState.someProperty.undefinedSubProperty
    }));
  }

  render () {
    return <button onClick={this.makeErrorHappen}>Error me!</button>;
  }
}

const ErrorComponentHOC = withErrorBoundary()(ErrorComponent);

class ErrorBoundaries extends Component {
  static displayName = 'ErrorBoundariesExample';

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Error Boundaries</h2>
        <div className={container}>
          <ul className={noMargin}>
            <li>
              Before react 16 if an error was thrown while the UI was rendering
              it would still display in a potentially corrupted state
            </li>
            <li>
              Now if an error is thrown it will cause the entire component tree
              to fail to mount
            </li>
            <li>
              To deal with this errors will propagate up the component tree
              until they reach a component that implements the componentDidCatch
              lifecycle method
            </li>
            <li>
              This will force developers to think more about error states as the
              default behaviour is to display nothing at all
            </li>
            <li>
              Not all errors will be caught by componentDidCatch, it is
              triggered by
              <ul>
                <li>Errors in render function of class components</li>
                <li>Errors in functional components</li>
                <li>Errors in constructors</li>
                <li>Errors in lifecycle methods</li>
                <li>Errors in setState (functional version)</li>
              </ul>
            </li>
            <li>
              Will <strong>NOT</strong> be triggered by errors in event
              listeners unless the error occurs in the functional version of
              setState
            </li>
          </ul>
        </div>
        <h3 className={noMargin}>Error</h3>
        <div className={container}>
          <p>
            If a componentDidCatch is not found the entire component tree is
            unmounted.
          </p>
          <ErrorComponent />
        </div>
        <h3 className={noMargin}>Error Boundary Higher Order Element</h3>
        <div className={container}>
          <p>
            While any component can implement componentDidCatch, having an error
            boundary element can make code more understandable.
          </p>
          <ErrorBoundaryHOE>
            <ErrorComponent />
          </ErrorBoundaryHOE>
        </div>
        <h3 className={noMargin}>Error Boundary Higher Order Component</h3>
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
