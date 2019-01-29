import React, { Component } from 'react'
import { StyleSheet, Dimensions } from 'react-native';
import {Container, Header, Content, Text, Button, List, ListItem, Spinner
} from 'native-base'
import { Font } from "expo"
import { connect } from 'react-redux'
import { strings } from '../locales/i18n';
import MapView from 'react-native-maps';


class PasseioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoading: true, // to load font in expo
      walkId: this.props.navigation.state.params.walkId,
      latitude: -8.137636,
      longitude: -34.907432,
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
        var walkId = this.state.walkId;     //ignorar nome da variavel
        for (i = 0; i < response.data.length; i++) {
          var pls = response.data[i].id;    //ignorar nome da variavel
          if(pls == walkId ){
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

  getTime() {
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
    this.Clock = setInterval( () => this.getTime(), 1000 );
    
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
    const {latitude, longitude} = this.state;
    if (this.state.fontLoading) {
      return (
        <Container style={{backgroundColor:'white'}}>
          <Header style={{backgroundColor:'red', marginTop: 24}}/>
        <Content>
          <Spinner color='red' />
        </Content>
      </Container>
      );
    } else {
    return (
      <Container style={styles.container}>
        <MapView
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0130,
            longitudeDelta: 0.0130,
          }}
          style={styles.mapView}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          showsPointsOfInterest={false}
          showBuildings={false}
        >
        </MapView>
        <Content style={styles.placesContainer}>
          <Content style={styles.place}>
            <Label> {strings('PasseioScreen.start')}: </Label>
              <Text style={{justifyContent:'center'}}>{this.state.horaInicio}</Text>
              <Right><Label> {strings('PasseioScreen.end')}: </Label></Right>
              <Text style={{justifyContent:'center'}}>{this.state.horaFinal}</Text>
            <List>
              <ListItem>
                <Button style={styles.button} onPress={this.showTimeInicio} disabled={!this.state.btnIniciar}>
                <Text>{strings('PasseioScreen.begin')}</Text>
                </Button>
                <Button style={styles.button} onPress={this.showTimeFim}>
                <Text>{strings('PasseioScreen.finalize')}</Text>
                </Button>
                <Button style={styles.button} onPress={this.sendWalk}>
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

  placesContainer:{
    width: '100%',
    maxHeight: 160,
  },

  place: {
    width: width - 40,
    maxHeight: 160,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },

  button:{
    backgroundColor: "red",
    borderRadius: 10,
    marginHorizontal:10
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