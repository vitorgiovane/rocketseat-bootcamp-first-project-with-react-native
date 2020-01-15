import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'

import api from '../../services/api'
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author
} from './styles'

export default class User extends Component {
  state = {
    stars: [],
    page: 1,
    loadingStarredRepos: false,
    stopRequestRepos: false
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
    const { page } = this.state
    const user = navigation.getParam('user')

    this.setState({ loadingStarredRepos: true })

    const response = await api.get(`/users/${user.login}/starred?page=${page}`)

    this.setState({
      stars: response.data
    })

    this.setState({ loadingStarredRepos: false })
  }

  loadMoreStarredRepos = async () => {
    if (this.state.stopRequestRepos) return
    const { navigation } = this.props
    const { page, stars } = this.state

    const nextPage = page + 1

    await this.setState({ page: nextPage })

    const user = navigation.getParam('user')
    const response = await api.get(
      `/users/${user.login}/starred?page=${this.state.page}`
    )

    if (response.data.length <= 0) return

    if (response.data.length < 30) this.setState({ stopRequestRepos: true })

    this.setState({
      stars: [...stars, ...response.data]
    })
  }

  render() {
    const { navigation } = this.props
    const { stars } = this.state
    const user = navigation.getParam('user')

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {this.state.loadingStarredRepos && (
          <ActivityIndicator color="#7159C1" size={150} />
        )}

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMoreStarredRepos}
        />
      </Container>
    )
  }
}
