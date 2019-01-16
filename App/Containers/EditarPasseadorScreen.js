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
import styles from './Styles/EditarPasseadorScreenStyle.js';
import { Dropdown } from 'react-native-material-dropdown';

class  EditarPasseadorScreen extends Component {
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
    const uri = "http://www.revistapronews.com.br/repository/news/big-153625870692-edenwololo1.jpg";
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
              <Icon name='arrow-back' />
            </Left>
            <Body>
              <Title style={{color: Colors.snow}}>{"Perfil"}</Title>
            </Body>
            <Right>

            </Right>
          </Header>
          <Content padder style={{ backgroundColor: 'white', alignContent: "stretch" }}>
            <List>
              <ListItem style={{ alignSelf: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <Thumbnail style={{ height: 120, width: 120 }} large source={{ uri: uri }} />
                <Text style={{color: Colors.steel}}>Alterar Foto</Text>
              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                  <Text>{"Alterar Nome:"}</Text>
                  <Input placeholder={'Eden Wiedemann'} />
                </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                  <Text>{"Alterar Email:"}</Text>
                  <Input placeholder={'eden.wiedemann@gmail.com'} />
                </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                  <Text>{"Alterar Endereço:"}</Text>
                  <Input placeholder={'Rua dos Bobos, nº 0'} />

              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                  <Text>{"Alterar Telefone:"}</Text>
                  <Input placeholder={'91234-5678'} />
                  


              </ListItem>
              <ListItem style={{ alignSelf: 'center' }}>

                  <Text>{'Confirmar Senha:'}</Text>
                  <Input secureTextEntry={true} placeholder={'        '} />


              </ListItem>
              

              
            </List>
            <Text>{""}</Text>
            <Button style={styles.botao}>
              <Text>{"Confirmar"}</Text>
            </Button>
          </Content>
          <Footer style={{ backgroundColor: 'red' }}>
            <FooterTab style={{ backgroundColor: 'red' }}>
              <Button>
                <Icon name='person' style={{ color: 'white' }} />
                <Text style={{ color: 'white' }}>{strings('Footer.profile_button')}</Text>
              </Button>
              <Button onPress={() => navigate('HistoricoClienteScreen')}>
                <Icon name='md-calendar' style={{ color: 'white' }} />
                <Text style={{ color: 'white' }}>{strings('Footer.history_button')}</Text>
              </Button>
              <Button onPress={() => navigate('ExtratoScreen')}>
                <Icon name='ios-paper' style={{ color: 'white' }} />
                <Text style={{ color: 'white' }}>{strings('Footer.extract_button')}</Text>
              </Button>
              <Button>
                <Icon name='walk' style={{ color: 'white' }} />
                <Text style={{ color: 'white' }}>{strings('Footer.walks_button')}</Text>
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
