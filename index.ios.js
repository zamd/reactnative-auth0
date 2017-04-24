/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';


import Home from './home';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Badge, Text} from 'native-base';

import env from './env';
import Login from './login';
import AbnLink from './abnlink';

const CLAIMS = {
    ABNLinked: `https://crm.telstra.net/abnLinked`
}

export default class mytelstra extends Component {
    constructor(){
        super();

        this.state = {
            access_token: "",
            abnLinked: false,
            abnLinking: false,
            abnVerificationPending: false,
            profile: {}
        }
    }
    _updateState(delta) {
        this.setState(Object.assign(this.state,delta));
    }
    _loginComplete(profile, id_token, access_token){
        const linked = profile[CLAIMS.ABNLinked];
        const stateChange = {
            profile: profile,
            id_token: id_token,
            access_token: access_token,
            abnLinked: linked,
            abnVerificationPending: false
        };
        this._updateState(stateChange);
    }

    _onLoginFailed(err){
        console.log(err);
        this.setState({
            access_token: ""
        });
    }
    _handleLinkAbn(){
        this._updateState({abnLinking: true});
    }

    _doAbnLink(abn){
        const userUrl = `https://${env.domain}/api/v2/users/${this.state.profile.sub}`;
        console.log(userUrl);
        console.log(this.state);
        const payload = JSON.stringify({
            user_metadata: {
                abn: abn,
                abn_verified: false
            }
        });

        fetch(userUrl, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.id_token}`
             },
            body: payload
        })
        .then(res=> {
            if (res.status==200)
                this._updateState({abnLinking: false, abnVerificationPending: true})
            else console.log(res);
        })
        .catch(err=>console.log(err));
    }


  render() {
      if (this.state.access_token) {
        if (this.state.abnLinking) {
            return (
             <AbnLink onLink={this._doAbnLink.bind(this)}/>
            );
        }
        else if (this.state.abnVerificationPending) {
            return (
                <Login onComplete={this._loginComplete.bind(this)} onFailed={this._onLoginFailed.bind(this)} silient={true} />
            )   
        }
        else {
            return (
            <Home profile={this.state.profile} abnLinked={this.state.abnLinked} onLinkAbn={this._handleLinkAbn.bind(this)}/>
            );
        }
      }
      else {
          return (
              <Login onComplete={this._loginComplete.bind(this)} onFailed={this._onLoginFailed.bind(this)} />
          )
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('mytelstra', () => mytelstra);
