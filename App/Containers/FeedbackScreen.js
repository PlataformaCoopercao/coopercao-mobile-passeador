import React, { Component } from 'react'
import StarRating from 'react-native-star-rating';
import { ScrollView, KeyboardAvoidingView, StyleSheet} from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Header, Title, Content, Body, Form, Text, Item, Textarea, Icon,
  Left, Right, Accordion, Root, Button, ActionSheet,
  Subtitle, Card, CardItem, List, Footer, FooterTab,
  Badge, Spinner, Thumbnail, ListItem, Label, Picker
} from 'native-base'
import { Font, AppLoading, Expo } from "expo"
import { Colors } from '../Themes/'
import { StackNavigator } from "react-navigation"
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { strings } from '../locales/i18n';
import { Alert } from 'react-native'
import axios from 'axios';
import * as firebase from 'firebase';
// Styles


class FeedbackScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.navigation.state.params.walkKey,
      fontLoading: true, // to load font in expo
      clicked: '',
      edited: '',
      selectedItem: undefined,
      selected: 'key0',
      selected2: 'kay0',
      obs:'',
      description: '',
      starCount: 2.5,
      results: {
          items: [],
      },
    };
  }
  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }


  addAvaliacao(key, obs, description, score, pee, poo){
    var url = 'https://us-central1-coopercao-backend.cloudfunctions.net/walkFeedback';
    axios.post(url, {walk_id: key, photoUrls: "", obs: obs, feedback:{description, score}, activities:{pee, poo}})
      .then(() => {
        Alert.alert(strings("FeedbackScreen.confirmFeedback"));
        this.props.navigation.navigate('MenuPasseadorScreen');
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }

  async componentWillMount() {
    console.log(this.state.key);
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ fontLoading: false });
  }

  render() {
    const { navigate } = this.props.navigation;
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
        <Root>
          <Container style={{backgroundColor:'red'}}>
          <Header style={{backgroundColor:'red', marginTop: 22}}>
              <Left><Icon name='arrow-back' onPress={() => navigate('HistoricoPasseadorScreen')} /></Left>
              <Body><Title style={{color: Colors.snow}}>{strings('FeedbackScreen.rateWalk')}</Title></Body>
              <Right/>
            </Header>
            <Content padder style={{backgroundColor: 'white'}}>
            <KeyboardAvoidingView behavior='position'>
              <Body>
              <StarRating
                disabled={false}
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'red'}
              />
                <Item>
                <Text>{strings('FeedbackScreen.pee')}</Text>
              <Picker
                iosHeader={strings("FeedbackScreen.chooseOne")}
                mode="dropdown"
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)} >
                  <Item label="1" value="1" />
                  <Item label="2" value="2" />
                  <Item label="3" value="3" />
                  <Item label="4" value="4" />
                  <Item label="5+" value="5" />
              </Picker>
                </Item>
                <Item>
                <Text>{strings('FeedbackScreen.poop')}</Text>
              <Picker
                iosHeader={strings("FeedbackScreen.chooseOne")}
                mode="dropdown"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)} >
                  <Item label="1" value="1" />
                  <Item label="2" value="2" />
                  <Item label="3" value="3" />
                  <Item label="4" value="4" />
                  <Item label="5+" value="5" />
              </Picker>
                </Item>
                <Item>
                  <Label customLabel>{strings('General.comments')}</Label>
                </Item>
                <Form>
                <Textarea style={{backgroundColor:'lightgrey', borderColor:'black', width: 300}} rowSpan={5} bordered placeholder={strings('FeedbackScreen.feedback')}
                onChangeText={(text) => { this.setState({ obs: text }) }}/>
              </Form>
              <Item>
                  <Label customLabel>{strings('FeedbackScreen.feedbackDog')}</Label>
                </Item>
              <Form>
                <Textarea style={{backgroundColor:'lightgrey', borderColor:'black', width: 300, marginTop: 10}} rowSpan={5} bordered placeholder={strings('FeedbackScreen.feedback')} 
                onChangeText={(text) => { this.setState({ description: text }) }} />
              </Form>
              </Body>
              <Body>
              <Button onPress={() => this.addAvaliacao(this.state.key, this.state.obs, this.state.description, this.state.starCount*2, this.state.selected, this.state.selected2)} style={{backgroundColor: 'red',  width: 150, height: 60, marginTop: 20, borderRadius: 5, position: 'relative', justifyContent: 'center'}}>
                 <Text style={{color:'white', fontSize: 16}}>{strings('General.rate_button')}</Text>
              </Button>
              </Body>
              </KeyboardAvoidingView>
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
      );
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackScreen)
