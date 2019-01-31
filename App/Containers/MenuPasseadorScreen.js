import React, { Component } from 'react'
import { Alert } from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Header, Title, Content, Body, Text, Icon,
  Left, Right, Button, List, Footer, FooterTab, Spinner, Thumbnail, ListItem
} from 'native-base'
import { Font } from "expo"
import { strings } from '../locales/i18n';
// Styles
import { Colors } from '../Themes';
import styles from './Styles/MenuPasseadorScreenStyle.js';
import axios from 'axios';
import * as firebase from 'firebase';

class MenuPasseadorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.uid,
      fontLoading: true, // to load font in expo
      nome: '',
      uri: '',
      loaded: false
    };
  }

  onLogoffPress = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('LoginScreen');
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }

  getWalkerData () {
    this.setState({loaded:false});
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getWalker', {id: firebase.auth().currentUser.uid})
    .then(response => this.setState({nome: response.data.name, uri: response.data.photoURL, loaded:true})).catch((error) => {Alert.alert(error.message)});
    this.forceUpdate()
  }

  // required to load native-base font in expo
  async componentDidMount() {
    this.getWalkerData();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
    this.forceUpdate();
  }

  render() {
    const {navigate} = this.props.navigation;
    if (!this.state.loaded) {
      return (
        <Container style={{backgroundColor:'white'}}>
        <Header style={{backgroundColor:'red', marginTop: 22}} />
      <Content>
        <Spinner color='red' />
      </Content>
    </Container>
      );
    } else {
      return (
        <Container style={{ backgroundColor: 'white' }}>
          <Header style={{ backgroundColor: 'red', marginTop: 24 }}>
            <Left>
            </Left>
            <Body>
              <Title style={{marginHorizontal: 10, color: Colors.snow}}>{strings('MenuPasseadorScreen.menu')}</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content padder style={{ backgroundColor: 'white', alignContent: "stretch" }}>
            <List>
              <ListItem style={{ alignSelf: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <Thumbnail style={{ height: 120, width: 120 }} large source={{ uri: this.state.uri }} />
                <Text>{strings('MenuPasseadorScreen.welcome')}{this.state.nome}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Button onPress={() => navigate('PasseadorPasseiosScreen')} style={styles.botao}>
                  <Text>{strings('MenuPasseadorScreen.scheduledWalks')}</Text>
                </Button>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Button onPress={() => navigate('PasseiosLivresScreen')} style={styles.botao}>
                  <Text>{strings('MenuPasseadorScreen.freeWalks')}</Text>
                </Button>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Button onPress={() => navigate('HistoricoPasseadorScreen')} style={styles.botao}>
                  <Text>{strings('MenuPasseadorScreen.walksHistory')}</Text>
                </Button>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Button onPress={() => navigate('PerfilPasseadorScreen')} style={styles.botao}>
                  <Text>{strings('MenuPasseadorScreen.profile')}</Text>
                </Button>
              </ListItem>
            </List>
            <Button onPress={this.onLogoffPress} style={styles.botao}>
              <Text>{strings('MenuPasseadorScreen.logout')}</Text>
            </Button>
          </Content>
          <Footer style={{backgroundColor:'red'}}>
                <FooterTab style={{backgroundColor:'red'}}>
                  <Button onPress={() => navigate('MenuPasseadorScreen')}>
                    <Icon name='md-person' type='Ionicons' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.menu_button')}</Text>
                  </Button>
                  <Button onPress={() => navigate('HistoricoPasseadorScreen')}>
                    <Icon name='md-calendar' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.history_button')}</Text>
                  </Button>
                  <Button onPress={() => navigate('PasseadorPasseiosScreen')}>
                    <Icon name='md-list-box' type='Ionicons' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.assign_button')}</Text>
                  </Button>
                  <Button onPress={() => navigate('PasseiosLivresScreen')}>
                    <Icon name='walk' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.available_button')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuPasseadorScreen)