import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import api from '../../services/api'

export default class User extends Component {
  state = {
    stars: []
  }

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func
    }).isRequired
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name
  })

  async componentDidMount() {
    const { navigation } = this.props
    const user = navigation.getParam('user')

    const response = await api.get(`/users/${user.login}/starred`)

    this.setState({
      stars: response.data
    })
  }

  render() {
    const { stars } = this.props
    return <View />
  }
}
