import React, { Component } from 'react'
import { Alert } from 'react-native'
import { connect } from 'react-redux'
import {Container, Header, Content, Body, Text, Left, Right,
  Button, List, Spinner, Input, ListItem, Thumbnail, InputGroup
} from 'native-base'
import { Font } from "expo"
import { strings } from '../locales/i18n';
import { Colors } from '../Themes';
import I18n from 'react-native-i18n';
import * as firebase from 'firebase';
// Styles
import styles from './Styles/PasseiosLivresScreenStyle'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      email: '',
      senha: '',
      remount: 1
    };
  }

  // required to load native-base font in expo
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  forceRemount() {
    this.setState({
      remount: this.state.remount + 1
    });
    this.componentDidMount();
    this.render();
  }

  setLocalePT(){
    I18n.locale = 'pt-BR';
    this.forceRemount();
    console.log(I18n.currentLocale())
  }

  setLocaleEN(){
    I18n.locale = 'en';
    this.forceRemount();
    console.log(I18n.currentLocale())
  }

  onEntrarPress = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.senha)
    .then(() => {
      this.props.navigation.navigate('MenuPasseadorScreen');
    }, (error) => {
      Alert.alert(error.message);
    });
  }

  render () {
    const {navigate} = this.props.navigation;
    if (this.state.fontLoading) {
      return (
        <Container style={{backgroundColor:'white'}}>
        <Header style={{backgroundColor:Colors.coal, marginTop: 22}} />
      <Content>
        <Spinner color={Colors.coal} />
      </Content>
    </Container>
      );
    } else {
    return (
        <Container>
          <Header style={{ backgroundColor: 'white', marginTop: 24}}>
          <Left>
      <Button onPress={() => this.setLocalePT()} style={{ backgroundColor: Colors.coal }}>
      <Text>{'PT'}</Text>
      </Button>
      </Left>
      <Right>
      <Button onPress={() => this.setLocaleEN()} style={{ backgroundColor: Colors.coal }}>
      <Text>{'EN'}</Text>
      </Button>
      </Right>
          </Header>
          <Content style={{alignContent:"stretch"}}>
          <Thumbnail style={{alignSelf:'center', height: 250, width: 250}} source={require('../Images/logoCoopercaoPasseador.png')}/>
        <List>
          <ListItem>
              <InputGroup>
                <Input placeholder={strings('LoginScreen.email')} keyboardType='email-address' autoCorrect={false}
                autoCapitalize='none' onChangeText={(text) => {this.setState({email: text})}} />
              </InputGroup>
          </ListItem> 
          <ListItem>
              <InputGroup>
                <Input placeholder={strings('LoginScreen.password')} autoCapitalize='none' autoCorrect={false}
                secureTextEntry={true} onChangeText={(text) => {this.setState({senha: text})}}/>
              </InputGroup>
          </ListItem>
      </List>
      <Button style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20, backgroundColor: Colors.coal }} onPress={this.onEntrarPress}>
      <Text>{strings('LoginScreen.enter')}</Text>   
      </Button>
      <Body/>
      <Right>
      <Button style={{ marginTop: 5, marginBottom: 5, backgroundColor:'gray' }}>
      <Text>{strings('LoginScreen.forgotPassword')}</Text>
      </Button>
      </Right>
        </Content>
        </Container>
        
    )
    }
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
