import React, { Component } from 'react'
import { StyleSheet, Dimensions, Alert} from 'react-native';
import {
  Container, Header, Content, Text, Button, List, ListItem, Spinner, Label, Left, Right
} from 'native-base'
import { Font } from "expo"
import { connect } from 'react-redux'
import { strings } from '../locales/i18n';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';
import axios from 'axios';


class PasseioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      walkId: this.props.navigation.state.params.walkId,
      region: null,
      loaded: false,
      time: '',
      horaInicio: '',
      horaFinal: '',
      btnIniciar: true,
      clicked: '',
      edited: '',
      walkState: {},
      walker: {},
      dateInicio: new Date(),
      dateFim: new Date()
    };
  }

  loadWalk() {
    //console.log("começa load Walk");
    //console.log(firebase.auth().currentUser.uid);
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/getAssignedWalks';
    axios.post(url, { walker_id: firebase.auth().currentUser.uid })
      .then((response) => {
        //console.log(response);
        var resposta = {};
        var walkId = this.state.walkId;     //ignorar nome da variavel
        for (i = 0; i < response.data.length; i++) {
          var pls = response.data[i].id;    //ignorar nome da variavel
          if (pls == walkId) {
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            //console.log(pls);
            //console.log(cursed);
            resposta = response.data[i];
            this.state.walkState = resposta;
          }
        }
        endereco = resposta.address.street + ", Num: " + resposta.address.num + "\n"
          + resposta.address.district + "\n" + resposta.address.compl;
        console.log("termina loadWalk");
      })
      .catch((error) => {
        console.warn(error.message);
        Alert.alert("Walk Error")
        this.props.navigation.navigate('MenuPasseadorScreen');
      });
  }

  loadWalker() {
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/getWalker'
    axios.post(url, { id: firebase.auth().currentUser.uid })
      .then((response) => {
        this.state.walker = response.data
        this.setState({ loaded: true });
        //console.log("BBBBBBBBBBBB");
      })
      .catch((error) => {
        console.warn(error.message);
        Alert.alert("Walker Error");
        this.props.navigation.navigate('MenuPasseadorScreen');
      });
  }

  getTime() {
    var date, TimeType, hour, minutes, seconds, fullTime;
    date = new Date();
    hour = date.getHours();
    if (hour <= 11) {
      TimeType = 'AM';
    } else {
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

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      ({coords: { latitude, longitude} }) => {
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0130,
            longitudeDelta: 0.0130
          }
        })
      }, //sucesso
      () => {}, //erro
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    )
    this.Clock = setInterval(() => this.getTime(), 1000);
    this.state.walkId = this.props.navigation.getParam('walkId', '0');

    await this.loadWalk();
    await this.loadWalker();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  componentWillUnmount() {
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
    diferenca = diffHrs + ":" + diffMins;
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
    const { navigate } = this.props.navigation;
    const { region } = this.state;
    if (!this.state.loaded) {
      return (
        <Container style={{ backgroundColor: 'white' }}>
          <Header style={{ backgroundColor: 'red', marginTop: 24 }} />
          <Content>
            <Spinner color='red' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <MapView
            initialRegion={region}
            style={styles.mapView}
            showsUserLocation
            loadingEnabled
            rotateEnabled={false}
            scrollEnabled={false}
            zoomEnabled={false}
            showsPointsOfInterest={false}
            showBuildings={false}
          >
          </MapView>
          <Content style={styles.placesContainer}>
            <Content style={styles.place}>
              <List>
                <ListItem>
                  <Label> {strings('PasseioScreen.start')}: </Label>
                  <Text style={{ justifyContent: 'center' }}>{this.state.horaInicio}</Text>
                </ListItem>
                <ListItem>
                  <Label> {strings('PasseioScreen.end')}: </Label>
                  <Text style={{ justifyContent: 'center' }}>{this.state.horaFinal}</Text>
                </ListItem>
                <ListItem>
                  <Button style={styles.buttonBegin} onPress={this.showTimeInicio} disabled={!this.state.btnIniciar}>
                    <Text>{strings('PasseioScreen.begin')}</Text>
                  </Button>
                  <Button style={styles.buttonFinalize} onPress={this.showTimeFim}>
                    <Text>{strings('PasseioScreen.finalize')}</Text>
                  </Button>
                  <Button style={styles.buttonSend} onPress={this.sendWalk}>
                    <Text>{strings('PasseioScreen.send')}</Text>
                  </Button>
                </ListItem>
              </List>
            </Content>
          </Content>
        </Container>
      )
    }
  }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },

  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  placesContainer: {
    width: '100%',
    maxHeight: 180,
  },

  place: {
    maxHeight: 180,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  buttonBegin: {
    backgroundColor: "red",
    borderRadius: 10,
    marginRight: 10
  },

  buttonFinalize: {
    backgroundColor: "red",
    borderRadius: 10,
    marginHorizontal: 10
  },

  buttonSend: {
    backgroundColor: "red",
    borderRadius: 10,
    marginLeft: 10
  },

});

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasseioScreen)