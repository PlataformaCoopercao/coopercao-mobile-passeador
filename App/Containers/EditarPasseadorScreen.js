import React, { Component } from 'react'
import { Alert } from 'react-native'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Header, Title, Content, Body, Text, Icon,
  Left, Right, Accordion, Root, Button, ActionSheet, Subtitle, Card,
  CardItem, List, Footer, FooterTab, Badge, Form, Item, Label, Input,
  Picker, Spinner, Thumbnail, Col, Grid, Row, ListItem, InputGroup
} from 'native-base'
import { Font, AppLoading, Expo } from "expo"
import { StackNavigator } from "react-navigation"
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
// Styles
import { Images, Colors } from '../Themes';
import { TextInput } from 'react-native-gesture-handler';
import styles from './Styles/EditarPasseadorScreenStyle.js';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import * as firebase from 'firebase';

class  EditarPasseadorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.uid,
      fontLoading: true, // to load font in expo
      nome: '',
      cpf: '',
      genero: '',
      estadoCivil: '',
      profissao: '',
      cep: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
      telefone: '',
      uri: '',
      loaded: false,
      walker: {}
    };
  }

  getWalkerData () {
    this.setState({loaded:false});
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getWalker', {id: firebase.auth().currentUser.uid})
    .then(response => {
    this.state.walker = response.data;
    this.setState({nome: response.data.name, cpf: response.data.cpf, genero: response.data.gender,
    estadoCivil: response.data.civilState, profissao: response.data.profession, cep: response.data.address.cep, bairro: response.data.address.district,
    rua: response.data.address.street, numero: response.data.address.num, complemento: response.data.address.compl, telefone: response.data.phoneNumber,
    uri: response.data.photoURL, loaded:true})}).catch((error) => {Alert.alert(error.message)});
  this.update()
  }

  update () {
    if(this.state.uri == null || this.state.uri == '') {
      this.setState({uri:'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'})
    }
    this.forceUpdate()
  }
  onSalvarPress = () => {
    this.submit()
  }

  submit() {
    let address = {}
      address.cep = this.state.cep,
      address.district = this.state.bairro,
      address.street = this.state.rua,
      address.num = this.state.numero,
      address.compl = this.state.complemento;
    var walker = {}
      walker.id = firebase.auth().currentUser.uid,
      walker.name = this.state.nome,
      walker.cpf = this.state.cpf,
      walker.email = this.state.walker.email,
      walker.civilState = this.state.estadoCivil,
      walker.profession = this.state.profissao,
      walker.phoneNumber = this.state.telefone,
      walker.photoURL = this.state.uri,
      walker.accumulated_score = this.state.walker.accumulated_score,
      walker.score = this.state.walker.score,
      walker.total_walks = this.state.walker.total_walks,
      walker.address = address;
    var walkerSend = {}
    walkerSend.walker = walker;
    //console.log(walker);
    //let collection = {}
    //  collection.uid = this.state.uid,
    //  collection.walker = walker;
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/updateWalker';
    axios.post(url, walkerSend)
      .then(() => {
        Alert.alert(strings("General.success"));
        this.props.navigation.navigate('MenuPasseadorScreen');
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  // required to load native-base font in expo
  async componentWillMount() {
    this.getWalkerData();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  render() {
    const {navigate} = this.props.navigation;
    if (!this.state.loaded) {
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
        <Container style={{ backgroundColor: Colors.coal }}>
          <Header style={{ backgroundColor: Colors.coal, marginTop: 25 }}>
            <Left>
              <Icon name='arrow-back' style={{ marginHorizontal: 10}} onPress={() => navigate('PerfilPasseadorScreen')} />
            </Left>
            <Body>
              <Title style={{ marginHorizontal: 10, color: Colors.snow }}>{strings('EditarPasseadorScreen.edit')}</Title>
            </Body>
            <Right>
            </Right>
          </Header>

          <Content style={{ backgroundColor: 'white', alignContent: "stretch" }}>
          <Thumbnail style={{ alignSelf:"center" }} large source={{ uri: this.state.uri }} />
          <List>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.name')} onChangeText={(text) => { this.setState({ nome: text }) }}>
                {this.state.nome}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.cpf')} onChangeText={(text) => { this.setState({ cpf: text }) }} >
                {this.state.cpf}</Input>
              </InputGroup>
            </ListItem>
           {/* <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.gender')} onChangeText={(text) => { this.setState({ genero: text }) }}>
                {this.state.genero}</Input>
              </InputGroup>
            </ListItem>*/}
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.civilState')} onChangeText={(text) => { this.setState({ estadoCivil: text }) }}>
                {this.state.estadoCivil}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.profession')} onChangeText={(text) => { this.setState({ profissao: text }) }}>
                {this.state.profissao}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.cep')} onChangeText={(text) => { this.setState({ cep: text }) }}>
                {this.state.cep}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.area')} onChangeText={(text) => { this.setState({ bairro: text }) }}>
                {this.state.bairro}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.street')} onChangeText={(text) => { this.setState({ rua: text }) }}>
                {this.state.rua}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.number')} onChangeText={(text) => { this.setState({ numero: text }) }}>
                {this.state.numero}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.complement')} onChangeText={(text) => { this.setState({ complemento: text }) }}>
                {this.state.complemento}</Input>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input placeholder={strings('EditarPasseadorScreen.phone')} onChangeText={(text) => { this.setState({ telefone: text }) }}>
                {this.state.telefone}</Input>
              </InputGroup>
            </ListItem>
          </List>
          <Button onPress={this.onSalvarPress} style={{ alignSelf: 'center', marginTop: 20, marginHorizontal: 40, backgroundColor:Colors.coal }}>
            <Text>{strings('EditarPasseadorScreen.save')}</Text>
          </Button>
          </Content>
          <Footer style={{ backgroundColor: Colors.coal }}>
            <FooterTab style={{ backgroundColor: Colors.coal }}>
                  <Button onPress={() => navigate('MenuPasseadorScreen')}>
                    <Icon name='md-person' type='Ionicons' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.menu_button')}</Text>
                  </Button>
                  <Button onPress={() => navigate('HistoricoPasseadorScreen')}>
                    <Icon name='md-calendar' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.history_button')}</Text>
                  </Button>
                  <Button vertical onPress={() => navigate('PasseadorPasseiosScreen')}>
                    <Icon name='md-list-box' type='Ionicons' style={{color:'white'}}/>
                    <Text style={{color:'white'}}>{strings('Footer.assign_button')}</Text>
                  </Button>
                  <Button vertical onPress={() => navigate('PasseiosLivresScreen')}>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditarPasseadorScreen)
