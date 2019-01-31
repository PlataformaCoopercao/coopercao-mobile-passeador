import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  botao: {
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: Colors.coal,
    width: Dimensions.get('window').width / 3,
    justifyContent: 'center'
  }
})
