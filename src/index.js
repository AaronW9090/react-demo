import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'emotion';
import App from './app';

injectGlobal`
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

  h1, h2, h3 {
    border-bottom: 1px solid #eee;
  }

  p {
    margin-top: 0px;
    line-height: 26px;
  }

  ul {
    line-height: 26px;
  }
`;

ReactDOM.render(<App />, document.getElementById('root'));
