import React, { Component } from 'react'
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
import styles from './Styles/PerfilPasseadorScreenStyle.js';
import { Dropdown } from 'react-native-material-dropdown';

class  PerfilPasseadorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
    };
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  // required to load native-base font in expo
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  render() {
    const uri = "https://pbs.twimg.com/media/DahEyvzVQAAizMF.jpg";
    const {navigate} = this.props.navigation;
    if (this.state.fontLoading) {
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
        <Container style={{ backgroundColor: 'red' }}>
          <Header style={{ backgroundColor: 'red', marginTop: 15 }}>
            <Left>
              <Icon name='arrow-back' onPress={() => navigate('MenuPasseadorScreen')} />
            </Left>
            <Body>
              <Title style={{color: Colors.snow, alignSelf: "auto"}}>{"Perfil"}</Title>
            </Body>
          </Header>
          <Content padder style={{ backgroundColor: 'white', alignContent: "stretch" }}>
            <List>
              <ListItem style={{ alignSelf: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <Thumbnail style={{ height: 120, width: 120 }} large source={{ uri: uri }} />
              </ListItem>
              <ListItem style={{alignSelf:'center'}}>
                <Label>Name: </Label>
                <Text>{"Alex Cimo"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Email: </Label>
                <Text>{"cimo.ygo@gmail.com"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Address: </Label>
                <Text>{"Rua dos Bobos, nº 0"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>CPF: </Label>
                <Text>{"567.953.684.15"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Marital status: </Label>
                <Text>{"Solteiro"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Profession: </Label>
                <Text>{"Arquiteto"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Phone: </Label>
                <Text>{"91234-5678"}</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>
                <Label>Operating Districts: </Label>
                <Text>{"Boa Viagem, Setubal, Pina"}</Text>
              </ListItem>
            </List>
            <Button style={styles.botao} onPress={() => navigate('EditarPasseadorScreen')}>
              <Text>{"Editar"}</Text>
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
