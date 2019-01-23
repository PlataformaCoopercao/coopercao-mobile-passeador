import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Header, Title, Content, Body, Text, Icon,
  Left, Right, Accordion, Root, Button, ActionSheet, Subtitle, Card, CardItem, List, Footer, FooterTab, Badge, Spinner
} from 'native-base'
import { Font, AppLoading, Expo } from "expo"
import { Colors } from '../Themes/'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
import axios from 'axios';
import * as firebase from 'firebase';
// Styles
import styles from './Styles/PasseadorPasseiosScreenStyle'

var BUTTONS = ["Iniciar Passeio", /*strings('PasseadorPasseiosScreen.requestReplace'), strings('PasseadorPasseiosScreen.cancelWalk'),*/ "Voltar"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

class PasseadorPasseiosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      uid: '',
      dataArrayPasseios: [],
      keyPasseios: [],
      walkId: ''
    };
  }

  getPasseiosAtribuidos() {
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getPasseiosAtribuidos', {passeadorKey: firebase.auth().currentUser.uid})
    .then((response) => {
      if(response.data != null) {
        for(x = 0; x < response.data.length; x++) {
          this.state.dataArrayPasseios[x] = strings('PasseadorPasseiosScreen.dog') + response.data[x].dog.name +
          '\n' + strings('PasseadorPasseiosScreen.date') + response.data[x].date + ' ' + strings('PasseadorPasseiosScreen.time') +
          response.data[x].time + '\n' + strings('PasseadorPasseiosScreen.address') + response.data[x].address.street + ', ' +
          response.data[x].address.num + ', ' + response.data[x].address.area
          this.state.keyPasseios[x] = response.data[x].key
        }
        this.forceUpdate()
      } else {
        console.log('Não tem passeios')
      }
    }).catch((error) => {Alert.alert(error.message)});
  }

  // required to load native-base font in expo
  async componentDidMount() {
    this.getPasseiosAtribuidos()
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  startSoloWalk(walkId) {
    this.props.navigation.navigate('PasseioScreen', {
      walkId: walkId
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.fontLoading) {
      return (
        <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 22}}/>
        <Content>
          <Spinner color='red' />
        </Content>
      </Container>
      );
    } else {
      if (this.state.clicked == "Iniciar Passeio") {
        return (
          <Root>
            <Container style={{ backgroundColor: 'red' }}>
              <Content style={{ backgroundColor: 'white', alignContent: "stretch" }}>
                <Button onPress={this.startSoloWalk(this.state.walkId)} style={{alignSelf: 'center', backgroundColor: 'red'}}>
                  <Text>{strings('PasseadorPasseiosScreen.startWalk')}</Text>
                </Button>
              </Content>
            </Container>
          </Root>
        );
      } else {
      return (
        <Root>
          <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 22}}>
              <Left><Icon name='arrow-back' onPress={() => navigate('MenuPasseadorScreen')} /></Left>
              <Body><Title style={{left: -90, color: Colors.snow}}>{strings('PasseadorPasseiosScreen.assignedWalks')}</Title></Body>
              
            </Header>
            <Content padder style={{backgroundColor: 'white'}}>
              <ScrollView>
                <List dataArray={this.state.dataArrayPasseios}
                  renderRow={(item) =>
                    <Card>
                      <CardItem style={{justifyContent: 'space-between'}}>
                      <Text>{item}</Text>
                      {<Button transparent dark
                        onPress={() =>
                          ActionSheet.show(
                            {
                              options: BUTTONS,
                              cancelButtonIndex: CANCEL_INDEX,
                              title: strings('PasseadorPasseiosScreen.walk')
                            },
                            buttonIndex => {
                              this.state.walkId = this.state.keyPasseios[this.state.dataArrayPasseios.indexOf(item)];
                              this.setState({ clicked: BUTTONS[buttonIndex] });
                            }
                          )}
                      >
                        <Icon type='Ionicons' name='ios-paw' />
                      </Button>}
                      </CardItem>
                    </Card>
                  }>
                </List>
              </ScrollView>
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
        </Root>
      )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(PasseadorPasseiosScreen)
