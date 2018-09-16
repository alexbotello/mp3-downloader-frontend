import React from 'react';
import { Footer, Container, Icon } from 'bloomer';

const Foot = props => {
  return(
    <Footer id="footer">
      <Container>
        <a href="https://bulma.io">
          <img src="https://bulma.io/images/made-with-bulma.png" alt="Made with Bulma" width="128" height="24"/>
        </a>
        <p>
          Made with <Icon isSize="small" hasTextColor="danger" className="fas fa-heart"></Icon> by <a href="https://github.com/alexbotello">Alexander Botello</a>
        </p>
      </Container>
    </Footer>
  )
}
export default Foot;