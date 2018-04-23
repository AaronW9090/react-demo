import React, { Component, Fragment } from 'react';
import { css } from 'emotion';
import ErrorBoundaries from './error-boundaries';
import Portals from './portals';
import LifecycleMethods from './lifecycle-methods';
import Refs from './refs';
import Context, { ContextProvider } from './context';
import Finish from './finish';

const container = css`
  display: flex;
  margin: 50px auto;
  align-items: flex-start;
  max-width: 1000px;
`;

const menuItem = css`
  height: 40px;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background-color: #007d54;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const content = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0px 20px 20px 20px;
  width: 100%;
`;

const active = css`
  background-color: #007d54;
`;

class Display extends Component {
  constructor (props) {
    super(props);
    this.state = {
      display: 'ErrorBoundariesExample'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (displayName) {
    this.setState(state => ({ display: displayName }));
  }

  render () {
    const { children } = this.props;
    const { display } = this.state;
    return (
      <Fragment>
        <div>
          {React.Children.map(children, child => (
            <div
              className={`${menuItem}${
                child.type.displayName === display ? ` ${active}` : ''
              }`}
              onClick={() => this.handleClick(child.type.displayName)}
            >
              {child.type.displayName}
            </div>
          ))}
        </div>
        <div className={content}>
          {React.Children.toArray(children).find(
            child => child.type.displayName === display
          )}
        </div>
      </Fragment>
    );
  }
}

class App extends Component {
  render () {
    return (
      <ContextProvider>
        <div className={container}>
          <Display>
            <ErrorBoundaries />
            <Portals />
            <LifecycleMethods />
            <Context />
            <Refs />
            <Finish />
          </Display>
        </div>
      </ContextProvider>
    );
  }
}

export default App;
