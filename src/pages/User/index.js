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
    stopRequestRepos: false,
    refreshing: false
  }

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func
    }).isRequired
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name
  })

  requestRepos = async () => {
    const { navigation } = this.props
    const user = navigation.getParam('user')
    const { page } = this.state
    const response = await api.get(`/users/${user.login}/starred?page=${page}`)

    return response.data
  }

  async componentDidMount() {
    this.setState({ loadingStarredRepos: true })
    const { stars } = this.state
    const repositories = await this.requestRepos()

    this.setState({
      stars: [...stars, ...repositories],
      loadingStarredRepos: false
    })
  }

  loadMoreStarredRepos = async () => {
    if (this.state.stopRequestRepos) return
    const { page, stars } = this.state

    const nextPage = page + 1

    await this.setState({ page: nextPage })

    const repositories = await this.requestRepos()

    if (repositories.length <= 0) return
    if (repositories.length < 30) this.setState({ stopRequestRepos: true })

    this.setState({
      stars: [...stars, ...repositories]
    })
  }

  refreshList = async () => {
    const firtsPage = 1
    await this.setState({ page: firtsPage, stopRequestRepos: false })
    const repositories = await this.requestRepos()
    this.setState({
      stars: repositories
    })
  }

  handleStarredNavigate = async (url, name) => {
    const { navigation } = this.props
    navigation.navigate('Starred', { url, name })
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
            <Starred
              onPress={() =>
                this.handleStarredNavigate(item.html_url, item.name)
              }>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          onEndReachedThreshold={0.3}
          onEndReached={this.loadMoreStarredRepos}
          onRefresh={this.refreshList}
          refreshing={this.state.refreshing}
        />
      </Container>
    )
  }
}
