import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, View, TouchableOpacity} from 'react-native'
import {Container, Header, Title, Content, Body, Text, Icon,
  Left, Right, Accordion, Root, Button, ActionSheet, Subtitle, Card,
   CardItem, Footer, FooterTab, Badge, Spinner, Label, ListItem, Thumbnail
} from 'native-base'
import { Font, AppLoading, Expo } from "expo"
import { connect } from 'react-redux'
import { Colors } from '../Themes/'
import { Alert } from 'react-native'
import axios from 'axios';
import * as firebase from 'firebase';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
// Styles
import styles from './Styles/PasseioScreenStyle'


var passeador = "João Bezerros"
var cao = "Managarmr"
var data = "10/12/2018"
var hora = "10:00"
var endereco = "Rua dos Bobos, nº 0"
var fotoPasseador = 'https://randomuser.me/api/portraits/men/66.jpg';
var fotoCao = 'https://images.dog.ceo/breeds/rottweiler/n02106550_1033.jpg';
let diffMs;
let diffHrs;
let diffDays;
let diferenca;
class PasseioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      horaInicio: '',
      horaFinal: '',
      btnIniciar: true,
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      walkState: {},
      walker: {},
      dateInicio: new Date(),
      dateFim: new Date()
    };
  }
  async componentWillMount() {
    await this.loadWalk();
    await this.loadWalker();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  async loadWalk(){
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/getPasseiosAtribuidos';
    await axios.post(url, { passeadorKey: firebase.auth().currentUser.uid })
      .then((response) => {
        var resposta = {};
        var cursed = this.state.walkId;     //ignorar nome da variavel
        for (i = 0; i < response.data.length; i++) {
          var pls = response.data[i].id;    //ignorar nome da variavel
          if(pls == cursed ){
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            //console.log(pls);
            //console.log(cursed);
            resposta = response.data[i];
            this.state.walkState = resposta;
          }
        }
        endereco = resposta.address.street + ", Num: " + resposta.address.num +"\n" 
        + resposta.address.district + "\n" + resposta.address.compl;
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  loadWalker(){
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/getWalker'
    axios.post(url, { uid: firebase.auth().currentUser.uid })
      .then((response) => {
        this.state.walker = response.data
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  GetTime() {
    var date, TimeType, hour, minutes, seconds, fullTime;
    date = new Date();
    hour = date.getHours();
    if (hour <= 11) {
      TimeType = 'AM';
    }
    else {
      TimeType = 'PM';
    }
    if (hour > 12) {
      hour = hour - 12;
    }
    if (hour == 0) {
      hour = 12;
    }
    minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }
    seconds = date.getSeconds();
    if (seconds < 10) {
      seconds = '0' + seconds.toString();
    }

    fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();

    this.setState({
      time: fullTime
    });
  }

  componentDidMount() {
    this.Clock = setInterval( () => this.GetTime(), 1000 );
    
    this.state.walkId = this.props.navigation.getParam('walkId', '0');
  }

  componentWillUnmount(){
    clearInterval(this.Clock);
  }

  showTimeInicio = () => {
    this.setState({
      btnColor: '#C1C1C1',
      horaInicio: this.state.time.toString(),
      btnIniciar: !this.state.btnIniciar
    });
    this.state.dateInicio = new Date();
  }
  showTimeFim = () => {
    this.setState({
      horaFinal: this.state.time.toString()
    });
    this.state.dateFim = new Date();
    diffMs = (this.state.dateFim - this.state.dateInicio);
    diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    diferenca = diffHrs+":"+diffMins;
  }

  sendWalk = () => {
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/endWalk';
    let submit = {}
    submit.walk = this.state.walkState,
    submit.walk_duration = diferenca,
    submit.route = "TODO";
    axios.post(url, submit)
      .then((response) => {
        this.props.navigation.navigate('MenuPasseadorScreen');
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  render() {
    const {navigate} = this.props.navigation;
    
    if (this.state.fontLoading) {
      return (
        <Container style={{backgroundColor:'black'}}>
          <Header style={{backgroundColor:'red', marginTop: 22}}/>
        <Content>
          <Spinner color='red' />
        </Content>
      </Container>
      );
    } else {
    return (
      // <ScrollView style={styles.container}>
      //   <KeyboardAvoidingView behavior='position'>
      //     <View style={styles.horizontal}>
      //       <Text style={styles.leftText}>Passeador: {passeador}</Text>
      //       <Text style={styles.rightText}>Cão: {cao}</Text>
      //     </View>
      //     <View style={styles.horizontal}>
      //       <Text style={styles.leftText}>Data: {data}</Text>
      //       <Text style={styles.rightText}>Horário: {hora}</Text>
      //     </View>
      //     <View style={styles.padding}>
      //       <Text style={styles.leftText}>Endereço: {endereco}</Text>
      //     </View>
      //     <View style={styles.padding}>
      //       <Text style={styles.leftText}>Início do passeio: {this.state.horaInicio}</Text>
      //     </View>
      //     <View style={styles.padding}>
      //       <Text style={styles.leftText}>Fim do passeio: {this.state.horaFinal}</Text>
      //     </View>
      //     <View style={styles.horizontal}>
      //     <TouchableOpacity style ={{
      //       width: 100,
      //        height: 45,
      //        justifyContent: 'center',
      //         marginTop: 20,
      //         borderRadius: 5,
      //         position: 'relative',
      //         backgroundColor: this.state.btnColor
      //          }} onPress={this.showTimeInicio} disabled={!this.state.btnIniciar}>
      //       <Text style={styles.textEntrar}>Iniciar</Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity style ={styles.btnEntrar} onPress={this.showTimeFim}>
      //       <Text style={styles.textEntrar}>Encerrar</Text>
      //     </TouchableOpacity>
      //     </View>
      //     <View style={{alignItems: 'center'}}>
      //     <TouchableOpacity style ={styles.btnFeedback}>
      //       <Text style={styles.textEntrar}>Prosseguir para o feedback</Text>
      //     </TouchableOpacity>
      //     </View>
      //   </KeyboardAvoidingView>
      // </ScrollView>
          <Root>
          <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 22}}>
              <Left><Icon name='arrow-back' onPress={() => navigate('PasseadorPasseiosScreen')} /></Left>
              <Body><Title style={{color: Colors.snow}}>{strings('General.walk')}</Title></Body>
              <Right/>
            </Header>
            <Content padder style={{backgroundColor: 'white'}}>
            <ScrollView>
                <Card>
                  <CardItem>
                    <Thumbnail large source={{uri: this.state.walker.photoUrl}} borderRadius='20'/>
                    <Right><Text style={{justifyContent:'center'}}> {this.state.walker.name}</Text></Right>
                  </CardItem>
                  <CardItem>
                    <Thumbnail large source={{uri: this.state.walkState.dog.photoUrl}} borderRadius='20'/>
                    <Right><Text style={{justifyContent:'center'}}>{this.state.walkState.dog.name}</Text></Right>
                  </CardItem>
                  <CardItem>
                    <Label> {strings('PasseioScreen.date')}: </Label>
                    <Text style={{justifyContent:'center'}}>{this.state.walkState.date}</Text>
                    <Right><Label> {strings('PasseioScreen.time')}: </Label></Right>
                    <Text style={{justifyContent:'center'}}>{this.state.walkState.time}</Text>
                  </CardItem>
                  <CardItem>
                    <Label style={{textAlign: 'auto', alignSelf: 'flex-start'}}>
                     {strings('PasseioScreen.address')}: </Label>
                    <Text>{endereco}</Text>
                  </CardItem>
                  <CardItem>
                  <Label> {strings('PasseioScreen.start')}: </Label>
                    <Text style={{justifyContent:'center'}}>{this.state.horaInicio}</Text>
                    <Right><Label> {strings('PasseioScreen.end')}: </Label></Right>
                    <Text style={{justifyContent:'center'}}>{this.state.horaFinal}</Text>
                  </CardItem>
                </Card>
                <Button style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10, backgroundColor:'red' }} onPress={this.showTimeInicio} disabled={!this.state.btnIniciar}> 
                  <Text>{strings('PasseioScreen.begin')}</Text>
                </Button>
                <Button style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10, backgroundColor:'red' }} onPress={this.showTimeFim}>
                  <Text>{strings('PasseioScreen.finalize')}</Text>
                </Button>
                <Button style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10, backgroundColor:'gray' }} onPress={this.sendWalk}>
                  <Text>{strings('PasseioScreen.ceaseSend')}</Text>
                </Button>
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
                  <Button badge vertical onPress={() => navigate('PasseadorPasseiosScreen')}>
                    <Badge style={{backgroundColor:'black'}}><Text style={{color:'white'}}>2</Text></Badge>
                    <Icon name='md-list-box' type='Ionicons' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.assign_button')}</Text>
                  </Button>
                  <Button badge vertical onPress={() => navigate('PasseiosLivresScreen')}>
                  <Badge style={{backgroundColor:'black'}}><Text style={{color:'white'}}>7</Text></Badge>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasseioScreen)