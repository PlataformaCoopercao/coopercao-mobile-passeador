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
      loaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
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
            <List>
              <ListItem>
                <Button style={styles.buttonStart}>
                <Text>{strings('PasseioScreen.begin')}</Text>
                </Button>
                <Button style={styles.buttonEnd}>
                <Text>{strings('PasseioScreen.finalize')}</Text>
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

  buttonStart:{
    backgroundColor: "red",
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginRight:30
  },

  buttonEnd:{
    backgroundColor: "red",
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginLeft:30
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