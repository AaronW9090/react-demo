import React, { Component, Fragment, createContext } from 'react';
import { css } from 'emotion';
import { container, heading } from './styles';
import ContextImage from './images/Context.png';

const { Provider, Consumer } = createContext();

const inputContainer = css`
  display: flex;
  flex-wrap: wrap;
  width: 40%;
  align-items: center;
`;

const input = css`
  flex: 1 0 100%;
  margin-top: 25px;
  color: #1e1f20;
`;

const wordBreak = css`
  word-break: break-all;
  white-space: pre;
  margin: 0 auto;
  max-width: 1000px;
  padding-left: 235px;
`;

const count = css`
  font-size: 24px;
`;

export const connect = mapStateToProps => WrappedComponent => {
  class Connect extends Component {
    render () {
      const { forwardRef, ...rest } = this.props;
      return (
        <Consumer>
          {({ state, actions }) => (
            <WrappedComponent
              {...rest}
              {...mapStateToProps(state)}
              ref={forwardRef}
              actions={actions}
            />
          )}
        </Consumer>
      );
    }
  }

  return React.forwardRef((props, ref) => (
    <Connect forwardRef={ref} {...props} />
  ));
};

export class ContextProvider extends Component {
  state = {
    counter: 0,
    form: {
      username: '',
      password: ''
    }
  };
  actions = {
    increment: () =>
      this.setState(state => ({ ...state, counter: state.counter + 1 })),
    changeFormValue: (name, value) =>
      this.setState(state => ({
        ...state,
        form: { ...state.form, [name]: value }
      }))
  };
  value = {
    state: this.state,
    actions: this.actions
  };

  render () {
    if (this.state !== this.value.state) {
      // If state was changed then recreate `this.value` so it will have a different reference
      // Explained here: https://reactjs.org/docs/context.html#caveats
      this.value = { actions: this.actions, state: this.state };
    }
    return (
      <Provider value={this.value}>
        {this.props.children}
        <div className={wordBreak}>{JSON.stringify(this.state, null, 4)}</div>
      </Provider>
    );
  }
}

class Counter extends Component {
  render () {
    const { counter, actions } = this.props;
    return (
      <Fragment>
        <div className={count}>{counter}</div>
        <br />
        <button onClick={actions.increment}>Increment</button>
      </Fragment>
    );
  }
}

function mapCountToProps (state) {
  return {
    counter: state.counter
  };
}
const ConnectedCounter = connect(mapCountToProps)(Counter);

class Form extends Component {
  render () {
    const { form, actions } = this.props;
    return (
      <Fragment>
        <div className={inputContainer}>
          <input
            className={input}
            type="text"
            value={form.username}
            onChange={e => {
              actions.changeFormValue('username', e.target.value);
            }}
          />
          <input
            className={input}
            type="password"
            value={form.password}
            onChange={e => {
              actions.changeFormValue('password', e.target.value);
            }}
          />
        </div>
      </Fragment>
    );
  }
}

function mapFormToProps (state) {
  return {
    form: state.form
  };
}
const ConnectedForm = connect(mapFormToProps)(Form);

class Context extends Component {
  static displayName = 'ContextExample';

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Context</h2>
        <h3 className={heading}>What</h3>
        <div className={container}>
          <p>
            React 16.3 introduces a new context API that is more declarative and
            easier to use. It is the first official React API to use the
            render-prop pattern.
          </p>
        </div>
        <h3 className={heading}>Why</h3>
        <div className={container}>
          <p>
            The old context API was{' '}
            <a href="https://github.com/facebook/react/issues/2517">
              fundamentally broken
            </a>{' '}
            and couldn't be fixed without making everything worse for everyone.
            It it extremely easy to have a component ignore updates to context
            just by having a middle component that is pure.
          </p>
        </div>
        <h3 className={heading}>How</h3>
        <div className={container}>
          <p>
            Context is now created as an object using the createContext()
            function, with Provider and Consumer components as its' properties.
            The provider component takes one prop - value - which will be passed
            to all consumers in the tree below. The consumer component will then
            take the value and use it as the parameter to its' children
            function. The createContext() function optionally accepts a default
            value to be passed to consumers without a Provider ancestor.
            Providers can be nested to override values deeper within the tree.
          </p>
          <img src={ContextImage} alt="" />
        </div>
        <h2>Consumers</h2>
        <div className={container}>
          <ConnectedCounter />
        </div>
        <div className={container}>
          <ConnectedForm />
        </div>
      </Fragment>
    );
  }
}

export default Context;
