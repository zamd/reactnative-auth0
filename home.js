import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Badge, Text, Spinner} from 'native-base';
import JSONTree from 'react-native-json-tree';
import env from './env';

export default class Home extends Component {
  constructor() {
    super();
  }


  render() {
    return (
      <Container>
          <Header>
              <Icon name="person" />
              <Text>Profile</Text>
          </Header>
          <Content>
            <JSONTree data={this.props.profile}/>
          </Content>
          <Footer >
              <FooterTab>
                  <Button onPress={this.props.onLinkAbn} disabled={this.props.abnLinked}>
                      <Icon name="link" />
                      <Text>Link ABN</Text>
                  </Button>
              </FooterTab>
          </Footer>
      </Container>
    );
  }
}

