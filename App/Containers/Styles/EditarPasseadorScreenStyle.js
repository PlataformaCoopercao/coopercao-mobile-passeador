import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'
const {width: WIDTH} = Dimensions.get('window')

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  botao: {
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: Colors.coal,
    width: Dimensions.get('window').width / 1.5,
    justifyContent: 'center'
  },
  input: {
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 25
  }
})
