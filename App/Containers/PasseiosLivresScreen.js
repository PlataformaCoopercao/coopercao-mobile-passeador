import React, { Component } from 'react'
import { ScrollView, Alert} from 'react-native'
import { connect } from 'react-redux'
import {Container, Header, Title, Content, Body, Text, Icon,
  Left, Right, Root, Button, ActionSheet, Card, List,
   CardItem, ListItem, Footer, FooterTab, Badge, Spinner
} from 'native-base'
import { Font } from "expo"
import { Colors } from '../Themes/'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
import axios from 'axios';
import * as firebase from 'firebase';

var BUTTONS = ["Atribuir Passeio", "Cancelar"];
var CANCEL_INDEX = 3;

class PasseiosLivresScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      dataArrayPasseios: [],
      walk: '',
      walker: '',
      walks: []
    };
  }

  getUnassignedWalks(){
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getUnassignedWalks')
    .then((response) =>{
      if(response.data != null){
        for(x = 0; x < response.data.length; x++){
          this.state.walks[x] = response.data[x]
          this.state.dataArrayPasseios[x] = 
          strings('PasseiosLivresScreen.dog') + response.data[x].dog.name + 
            '\n' + strings('PasseiosLivresScreen.date') + response.data[x].date + '  ' +
            strings('PasseiosLivresScreen.time') + response.data[x].time
          
        }
        this.forceUpdate()
      }else{
        console.log('Não tem passeios')
      }
    }).catch((error) => {Alert.alert(error.message)});
  }

  getWalkerData () {
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getWalker', {id: firebase.auth().currentUser.uid})
    .then(response => this.setState({walker: response.data})).catch((error) => {Alert.alert(error.message)});
    this.forceUpdate()
  }
  
  assingWalk(){
    console.log(this.state.walker)
    console.log(this.state.walk)
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/assignWalk', {walk: this.state.walk, walker: firebase.auth().currentUser.uid})
    .then((response) =>{
      Alert.alert("Passeio atribuido com sucesso")
    }).catch((error) => {Alert.alert(error.message)});
  }

  // required to load native-base font in expo
  async componentDidMount() {
    this.getUnassignedWalks()
    this.getWalkerData()
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
    this.forceUpdate()
  }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.fontLoading) {
      return (
        <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 25}}/>
        <Content>
          <Spinner color='red' />
        </Content>
      </Container>
      );
    } else {
      return (
        <Root>
          <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 25}}>
              <Left><Icon name='arrow-back' style={{ marginHorizontal: 10}} onPress={() => navigate('MenuPasseadorScreen')} /></Left>
              <Body><Title style={{color: Colors.snow}}>{strings('PasseiosLivresScreen.availableTitle')}</Title></Body>
            </Header>
            <Content padder style={{backgroundColor: 'white'}}>
              <ScrollView>
                <List dataArray={this.state.dataArrayPasseios}
                  renderRow={(item) =>
                    <Card>
                      <CardItem style={{justifyContent: 'space-between'}}>
                      <Text>{item}</Text>
                      <Button transparent dark onPress={() => {this.state.walk = this.state.walks[this.state.dataArrayPasseios.indexOf(item)], this.assingWalk()}}>
                        <Icon type='Ionicons' name='ios-paw' />
                      </Button>
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

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasseiosLivresScreen)
