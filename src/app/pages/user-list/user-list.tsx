import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, BorkType } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import './user-list.scss'

export enum FollowsType {
  following = 'following',
  followers = 'followers',
}

export interface UserListParams {
  ref: string
}

export interface UserListProps extends AuthProps, RouteComponentProps<UserListParams> {
  filter: BorkType.rebork | BorkType.like | FollowsType
}

export interface UserListState {
  title: string
  users: User[]
}

class UserListPage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      title: '',
      users: [],
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    let title = ''
    let users = []
    const filter = this.props.filter

    if (filter === BorkType.rebork || filter === BorkType.like) {
      title = filter === BorkType.rebork ? 'Reborks' : 'Likes'
      users = await this.webService.getUsersByTx(this.props.match.params.ref, filter)
    } else {
      title = filter
      users = await this.webService.getUsersByUser(this.props.match.params.ref, filter)
    }

    this.props.setTitle(title)
    this.props.setShowFab(false)

    this.setState({
      title,
      users,
    })
  }

  render () {
    const { users } = this.state

    return !users.length ? (
      <p style={{ margin: 14 }}>No {this.state.title}</p>
    ) : (
      <ul className="user-list">
        {users.map(user => {
          return (
            <li key={user.address}>
              <div className="user-item">
                <div className="user-item-follow">
                  <FollowButton user={user} />
                </div>
                <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                  <img src={user.avatar || defaultAvatar} className="user-item-avatar" />
                  <span style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</span><br />
                  <span style={{ color: 'gray' }}>@{user.address.substring(0,11)}</span><br />
                  <p style={{ marginLeft: 64, color: 'black' }}>{user.bio}</p>
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default withAuthContext(UserListPage)