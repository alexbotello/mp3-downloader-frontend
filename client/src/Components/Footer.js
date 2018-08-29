import React from 'react';
import { Footer, Container, Icon } from 'bloomer';

const Foot = props => {
  return(
    <Footer id="footer">
      <Container>
        <p>Made with <Icon hasTextColor='danger' className="fa fa-heart"></Icon> by Alexander Botello</p>
      </Container>
    </Footer>
  )
}
export default Foot;