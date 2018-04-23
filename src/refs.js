import React, { Component, createRef, forwardRef } from 'react';
import { css } from 'emotion';
import { connect } from './context';
import { container, heading } from './styles';

const Fragment = React.Fragment;

const forwardRefContainer = css`
  display: flex;
  flex-direction: column;
  & * {
    margin-bottom: 15px;
  }
`;

class ForwardRef extends Component {
  forwardedRef = createRef();
  connectedForwardedRef = createRef();

  componentDidMount () {
    console.log(this.forwardedRef);
    console.log(this.connectedForwardedRef);
  }

  render () {
    return (
      <div className={forwardRefContainer}>
        <ForwardedInputField ref={this.forwardedRef} />
        <button
          style={{
            width: '150px'
          }}
          onClick={() => {
            this.forwardedRef.current.focus();
          }}
        >
          Focus Forwarded Input
        </button>
        <ConnectedInputField name="username" ref={this.connectedForwardedRef} />
        <button
          style={{
            width: '200px'
          }}
          onClick={() => {
            this.connectedForwardedRef.current.focus();
          }}
        >
          Focus Connected Forwarded Input
        </button>
      </div>
    );
  }
}

function InputField (props, ref) {
  return (
    <input
      style={{ color: '#1e1f20' }}
      type="text"
      ref={ref}
      value={props.value}
      onChange={e =>
        props.actions &&
        props.actions.changeFormValue(props.name, e.target.value)
      }
    />
  );
}

const ForwardedInputField = forwardRef(InputField);

function mapFormValueToProps (state) {
  return {
    value: state.form.username
  };
}

const ConnectedInputField = connect(mapFormValueToProps)(ForwardedInputField);

class Refs extends Component {
  static displayName = 'RefsExample';

  render () {
    return (
      <Fragment>
        <h2 className={heading}>Refs</h2>
        <h3 className={heading}>What</h3>
        <div className={container}>
          <p>
            React 16.3 introduces new ways to handle refs, in addition to string
            refs and the callback function.
          </p>
          <p>
            It also introduces a way to forward refs from parent components to
            the inner child.
          </p>
        </div>
        <h3 className={heading}>Why</h3>
        <div className={container}>
          <p>
            While the functional way to set refs is more flexible it can be more
            readable to just create a ref and attach it to a node.
          </p>
          <p>
            Passing a ref to a class component didn't always have the effect
            that was desired, often when encapsulating elements such as buttons
            and input fields you would want a ref to the underlying DOM node
            instead of the class instance that is it's parent. This was a bit of
            a pain as you had to use the setRef pattern and send the ref up to
            whatever component was implementing it.
          </p>
        </div>
        <h3 className={heading}>How</h3>
        <div className={container}>
          <p>
            Creating a ref is now as simple as calling React.createRef() and
            passing that as the ref property on a node.
          </p>
          <p>
            To forward a ref you can use the React.forwardRef() function which
            takes a functional component as it's parameter, passing that
            component props and ref as the second argument.
          </p>
          <p>
            This can be especially useful when using HOCs, if you pass a ref to
            a component wrapped in a HOC it will attach the ref to the wrapping
            component instead of the component that you would expect when using
            it.
          </p>
        </div>
        <h3 className={heading}>Forwarding Refs</h3>
        <div className={container}>
          <ForwardRef />
        </div>
      </Fragment>
    );
  }
}

export default Refs;
