import React, { Component } from 'react'
import { Alert} from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Header, Title, Content, Body, Text, Icon,
  Left, Button, List, Footer, FooterTab, Badge, Spinner,
  Thumbnail, ListItem, Label
} from 'native-base'
import { Font } from "expo"
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
// Styles
import { Colors } from '../Themes';
import styles from './Styles/PerfilPasseadorScreenStyle.js';
import axios from 'axios';
import * as firebase from 'firebase';

class  PerfilPasseadorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.uid,
      fontLoading: true, // to load font in expo
      nome: '',
      email: '',
      endereco: '',
      cpf: '',
      estadoCivil: '',
      profissao: '',
      telefone: '',
      nota: '',
      uri: 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
      loaded: false
    };
  }

  getWalkerData () {
    this.setState({loaded:false});
    this.getUnassignedWalks()
    axios.post('https://us-central1-coopercao-backend.cloudfunctions.net/getWalker', {id: firebase.auth().currentUser.uid})
    .then(response => this.setState({nome: response.data.name, uri: response.data.photoURL, email: response.data.email,
      endereco: response.data.address.street, telefone: response.data.phoneNumber, cpf: response.data.cpf, estadoCivil: response.data.civilState,
      profissao: response.data.profession, bairros: response.data.areas, nota: response.data.score, loaded:true})).catch((error) => {Alert.alert(error.message)});
    this.update()
  }

  update () {
    if(this.state.uri == null || this.state.uri == ''){
      this.setState({uri: 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'})
    }
    this.forceUpdate()
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
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
  }

  render() {
    const {navigate} = this.props.navigation;
    if (!this.state.loaded) {
      return (
        <Container>
          <Header />
          <Content>
            <Spinner color='red' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={{ backgroundColor: 'white' }}>
          <Header style={{ backgroundColor: 'red', marginTop: 25 }}>
            <Left>
              <Icon name='arrow-back' style={{ marginHorizontal: 10}} onPress={() => navigate('MenuPasseadorScreen')} />
            </Left>
            <Body>
              <Title style={{ marginHorizontal: 10, color: Colors.snow, alignSelf: "auto"}}>{strings('PerfilPasseadorScreen.profile')}</Title>
            </Body>
          </Header>
          <Content padder style={{ backgroundColor: 'white', alignContent: "stretch" }}>
            <List>
              <ListItem style={{ alignSelf: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <Thumbnail style={{ height: 120, width: 120 }} large source={{ uri: this.state.uri }} />
                <Text>{this.state.nome} - {this.state.nota}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.email')}</Label>
                <Text>{this.state.email}</Text>

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.address')}</Label>
                <Text>{this.state.endereco}</Text>

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.cpf')}</Label>
                <Text>{this.state.cpf}</Text>

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.marital')}</Label>
                <Text>{this.state.estadoCivil}</Text>

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.profession')}</Label>
                <Text>{this.state.profissao}</Text>

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                <Label>{strings('PerfilPasseadorScreen.phone')}</Label>
                <Text>{this.state.telefone}</Text>

              </ListItem>
            </List>
            <Button style={styles.botao} onPress={() => navigate('EditarPasseadorScreen')}>
              <Text>{strings('PerfilPasseadorScreen.edit')}</Text>
            </Button>
          </Content>
          <Footer style={{ backgroundColor: 'red' }}>
            <FooterTab style={{ backgroundColor: 'red' }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(PerfilPasseadorScreen)
