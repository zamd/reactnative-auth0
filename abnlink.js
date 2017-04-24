import React, { Component } from 'react';
import { Container, Content, Header, Text, Form, Item, Input, Button} from 'native-base';


export default class AbnLink extends Component {
  constructor() {
    super();
    this.state = {};
  }

  _updateState(delta) {
      this.setState(Object.assign(this.state,delta));
  }
  handleChange(val) {
    this._updateState({abn:val})
  }
  render() {
    return (
        <Container>
          <Header>
            <Text>Link ABN with account </Text>
          </Header>
            <Content>
                <Form>
                    <Item>
                        <Input placeholder="ABN" onChangeText={this.handleChange.bind(this)}/>
                    </Item>
                </Form>
                <Button full onPress={()=>this.props.onLink(this.state.abn)}>
                    <Text>Link</Text>
                </Button> 
            </Content>
        </Container>
    );
  }
}

