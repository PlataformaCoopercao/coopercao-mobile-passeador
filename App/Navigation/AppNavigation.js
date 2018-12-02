import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import LoginScreen from  '../Containers/LoginScreen.js'
import PasseadorPasseiosScreen from '../Containers/PasseadorPasseiosScreen.js'
import PasseiosLivresScreen from '../Containers/PasseiosLivresScreen.js'
import HistoricoPasseadorScreen from '../Containers/HistoricoPasseadorScreen.js'
import PasseioScreen from '../Containers/PasseioScreen.js'
import FeedbackScreen from '../Containers/FeedbackScreen.js'
import MenuPasseadorScreen from '../Containers/MenuPasseadorScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createBottomTabNavigator({
  LoginScreen: { screen: LoginScreen },
  PasseadorPasseiosScreen: { screen: PasseadorPasseiosScreen },
  PasseiosLivresScreen: { screen: PasseiosLivresScreen},
  HistoricoPasseadorScreen: { screen: HistoricoPasseadorScreen},
  PasseioScreen: { screen: PasseioScreen},
  FeedbackScreen: { screen: FeedbackScreen},
  MenuPasseadorScreen: { screen: MenuPasseadorScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LoginScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
