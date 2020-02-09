import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import PropTypes from 'prop-types'

export default class Starred extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func
    }).isRequired
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name')
  })

  render() {
    const { navigation } = this.props
    const url = navigation.getParam('url')
    return <WebView source={{ uri: url }} style={{ flex: 1 }} />
  }
}
