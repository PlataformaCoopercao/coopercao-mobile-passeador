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

var BUTTONS = ["Marcar para passeio", /*"Requisitar Substituição", /*strings('PasseadorPasseiosScreen.cancelWalk'),*/ "Voltar"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 1;

var MARCADOS = [];

class PasseadorPasseiosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      uid: '',
      dataArrayPasseios: [],
      idPasseios: [],
      walkId: '',
      loaded: false,
      passeiosMarcados: [],
      startColor: "black",
      respostaCompleta: {}
    };
  }

  getAssignedWalks() {
    this.setState({ loaded: false });
    if (Object.entries(this.state.respostaCompleta).length === 0) {
      axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getAssignedWalks', { walker_id: firebase.auth().currentUser.uid })
        .then((response) => {
          if (response.data != null) {
            this.setState({ respostaCompleta: response });
            for (x = 0; x < response.data.length; x++) {
              this.state.dataArrayPasseios[x] = strings('PasseadorPasseiosScreen.dog') + response.data[x].dog.name +
                '\n' + strings('PasseadorPasseiosScreen.date') + response.data[x].date + ' ' + strings('PasseadorPasseiosScreen.time') +
                response.data[x].time + '\n' + strings('PasseadorPasseiosScreen.address') + response.data[x].address.street + ', ' +
                response.data[x].address.num + ', ' + response.data[x].address.district;
              this.state.idPasseios[x] = response.data[x].id;
              this.state.passeiosMarcados[x] = "snow";    //não marcado
            }
            //MARCADOS = this.state.passeiosMarcados;
            //console.log(this.state.idPasseios);
            this.setState({ loaded: true });
            this.forceUpdate()
          } else {
            console.log('Sem passeios agendados')
          }
        }).catch((error) => { Alert.alert(error.message) });
    } else {    //dando refresh após marcar passeio
      for (x = 0; x < this.state.respostaCompleta.data.length; x++) {
        this.state.dataArrayPasseios[x] = strings('PasseadorPasseiosScreen.dog') + this.state.respostaCompleta.data[x].dog.name +
          '\n' + strings('PasseadorPasseiosScreen.date') + this.state.respostaCompleta.data[x].date + ' ' + strings('PasseadorPasseiosScreen.time') +
          this.state.respostaCompleta.data[x].time + '\n' + strings('PasseadorPasseiosScreen.address') + this.state.respostaCompleta.data[x].address.street + ', ' +
          this.state.respostaCompleta.data[x].address.num + ', ' + this.state.respostaCompleta.data[x].address.district;
        this.state.idPasseios[x] = this.state.respostaCompleta.data[x].id;
        if (this.state.passeiosMarcados[x] != "grey") {
          this.state.passeiosMarcados[x] = "snow";    //não marcado
        }
      }
      //console.log(this.state.idPasseios);
      this.setState({ loaded: true });
      this.forceUpdate()
    }

  }

  // required to load native-base font in expo
  async componentDidMount() {
    this.getAssignedWalks()
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

  startWalks(idPasseios) {
    var walks = new Array();
    for (var y = 0; y < idPasseios.length; y++) {
      if (this.state.passeiosMarcados[y] === "grey") {
        walks.push(idPasseios[y]);
      }
    }
    if (walks.length < 1) {
      Alert.alert(strings('PasseadorPasseiosScreen.noWalkSelected'));
    } else {
      this.props.navigation.navigate('PasseioScreen', { walkId: walks });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.loaded) {
      return (
        <Container style={{ backgroundColor: 'white' }}>
          <Header style={{ backgroundColor: Colors.coal, marginTop: 22 }} />
          <Content>
            <Spinner color={Colors.coal} />
          </Content>
        </Container>
      );
    } else {
      return (
        <Root>
          <Container style={{ backgroundColor: Colors.coal }}>
            <Header style={{ backgroundColor: Colors.coal, marginTop: 25 }}>
              <Left><Icon name='arrow-back' onPress={() => navigate('MenuPasseadorScreen')} /></Left>
              <Body><Title style={{ marginHorizontal: 10, color: Colors.snow }}>{strings('PasseadorPasseiosScreen.assignedWalks')}</Title></Body>

            </Header>
            <Content padder style={{ backgroundColor: 'white' }}>
              <ScrollView>
                <Button style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20, backgroundColor: this.state.startColor }}
                  onPress={() => this.startWalks(this.state.idPasseios)}>
                  <Text>{strings('PasseadorPasseiosScreen.startWalk')}</Text>
                </Button>
                <List dataArray={this.state.dataArrayPasseios}
                  renderRow={(item) =>
                    <Card>
                      <CardItem style={{
                        justifyContent: 'space-between',
                        backgroundColor: this.state.passeiosMarcados[this.state.dataArrayPasseios.indexOf(item)]
                      }}>
                        {<Button transparent dark
                          onPress={() =>
                            ActionSheet.show(
                              {
                                options: BUTTONS,
                                cancelButtonIndex: CANCEL_INDEX,
                                title: strings('PasseadorPasseiosScreen.walk')
                              },
                              buttonIndex => {
                                this.state.walkId = this.state.idPasseios[this.state.dataArrayPasseios.indexOf(item)];
                                if (BUTTONS[buttonIndex] == "Marcar/Desmarcar para passeio") {
                                  //this.startSoloWalk(this.state.walkId)
                                  if (this.state.passeiosMarcados[this.state.dataArrayPasseios.indexOf(item)] === "grey") {
                                    this.state.passeiosMarcados[this.state.dataArrayPasseios.indexOf(item)] = "snow";
                                    for (var ind = 0, markeds = 0; ind < this.state.passeiosMarcados.length; ind++) {
                                      if (this.state.passeiosMarcados[ind] === "grey") {
                                        markeds++;
                                      }
                                      if (ind === this.state.passeiosMarcados.length - 1 && markeds < 1) {
                                        this.setState({ startColor: "black" });
                                      }
                                    }
                                    this.componentDidMount();
                                  } else {
                                    this.state.passeiosMarcados[this.state.dataArrayPasseios.indexOf(item)] = "grey";
                                    this.setState({ startColor: "red" });
                                    this.componentDidMount();
                                  }
                                } /*else if(BUTTONS[buttonIndex] == "Requisitar Substituição") {
                                console.log("Substituir")
                              }*/
                              }
                            )}
                        >
                          <Icon type='Ionicons' name='ios-paw' />
                        </Button>}
                        <Text>{item}</Text>
                      </CardItem>
                    </Card>
                  }>

                </List>
              </ScrollView>
            </Content>
            <Footer style={{ backgroundColor: Colors.coal }}>
              <FooterTab style={{ backgroundColor: Colors.coal }}>
                <Button onPress={() => navigate('MenuPasseadorScreen')}>
                  <Icon name='md-person' type='Ionicons' style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>{strings('Footer.menu_button')}</Text>
                </Button>
                <Button onPress={() => navigate('HistoricoPasseadorScreen')}>
                  <Icon name='md-calendar' style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>{strings('Footer.history_button')}</Text>
                </Button>
                <Button onPress={() => navigate('PasseadorPasseiosScreen')}>
                  <Icon name='md-list-box' type='Ionicons' style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>{strings('Footer.assign_button')}</Text>
                </Button>
                <Button onPress={() => navigate('PasseiosLivresScreen')}>
                  <Icon name='walk' style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>{strings('Footer.available_button')}</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        </Root>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasseadorPasseiosScreen)