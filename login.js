import React, { Component } from 'react';
import {Linking} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Badge, Text, Spinner} from 'native-base';
import {Authentication} from 'auth0-js';
import SafariView from 'react-native-safari-view';
import env from './env';

const url = require('url');

export default class Login extends Component {

    constructor(){
        super();
        this.state = {
            loginInProcess: false,
            profileFetch: false
        };
        this.auth = new Authentication({domain: env.domain,clientID:env.clientID});
    }

    //TODO: Enable PKCE...

    // base64URLEncode(str) {
    //     return str.toString('base64')
    //         .replace(/\+/g, '-')
    //         .replace(/\//g, '_')
    //         .replace(/=/g, '');
    // }
    // sha256(buffer) {
    //     return crypto.createHash('sha256').update(buffer).digest();
    // }

    onLoginClick() {
        this.setState({
            loginInProcess: true,
            profileFetch: false
        });
        // this.verifier = this.base64URLEncode(crypto.randomBytes(32));
        // const challenge = this.base64URLEncode(this.sha256(this.verifier));

        const prams = {
            responseType: 'code',
            scope: env.scope,
            // code_challenge: challenge,
            // code_challenge_method: "S256",
            redirectUri: env.redirectUri
        };
        const _url = this.auth.buildAuthorizeUrl(prams);
        SafariView.show({url:_url});
    }


  _fetchProfile(access_token) {
      return fetch(`https://${env.domain}/userinfo`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
            }
        });
    }

  _handleCallback(event) {
      SafariView.dismiss();
      const response = url.parse(event.url,true);
      const code = response.query.code; //TODO error handling...

      if (code) {
        const tokenRequestPayload = JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                client_id: env.clientID,
                redirect_uri: env.redirectUri,
                scope: env.scope
            });

        fetch(`https://${env.domain}/oauth/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
             },
            body: tokenRequestPayload
        })
        .then(res=>res.json())
        .then(json=>{
            const {id_token, access_token} = json;
            this.setState({
                    loginInProcess:false,
                    profileFetch: true
                 });

            this._fetchProfile(access_token)
            .then(res=>res.json())
            .then(json=>{
                this.setState({
                    loginInProcess:false,
                    profileFetch: false
                 });
            this.props.onComplete(json, id_token, access_token);
            })
        })
        .catch(err=>{

            this.setState({
                loginInProcess:false
            });
            this.props.onFailed(err);
        });
      }

  }

  componentDidMount(){
      Linking.addEventListener('url', this._handleCallback.bind(this));
      if (this.props.silient) {
        const prams = {
            responseType: 'code',
            scope: env.scope,
            prompt: 'none',
            // code_challenge: challenge,
            // code_challenge_method: "S256",
            redirectUri: env.redirectUri
        };
        const _url = this.auth.buildAuthorizeUrl(prams);
        SafariView.show({url:_url}); 
      }
  }

  render() {

    if (this.props.silient) {
        return (
             <Container>
                 <Header/>
                 <Content>
                    <Spinner color='blue' />
                 </Content>
            </Container>
        );
    }

    if (this.state.loginInProcess) {
        return (
             <Container>
                 <Header/>
                 <Content>
                     <Text>Login in process...</Text>
                    <Spinner color='red' />
                 </Content>
            </Container>
        );
    }
    if (this.state.profileFetch) {
        return (
             <Container>
                 <Header/>
                 <Content>
                     <Text>Fetching profile...</Text>
                    <Spinner color='green' />
                 </Content>
            </Container>
        );
    }
    return (
        <Container>
            <Header/>
            <Content>
                <Text>Login using Auth0 </Text>
                    <Button full onPress={this.onLoginClick.bind(this)}>
                        <Text>Login</Text>
                    </Button> 
            </Content>
        </Container>
    );
  }
}

