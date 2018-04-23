import React, { Component } from 'react';
import Confetti from 'react-confetti';

const Fragment = React.Fragment;

class Finish extends Component {
  static displayName = 'Finish';

  render () {
    return (
      <Fragment>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            width: '100%'
          }}
        >
          <p style={{ fontSize: '42px', margin: '0 auto' }}>Thankyou</p>
        </div>
        <Confetti width={2000} height={2000} />
      </Fragment>
    );
  }
}

export default Finish;
