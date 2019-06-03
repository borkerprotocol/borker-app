import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import { User } from '../../../../types/types'
import { RouteComponentProps } from 'react-router'
import './profile-edit.scss'
import '../../../App.scss'
import { BorkType } from 'borker-rs-browser'

export interface ProfileEditParams {
  type: BorkType.SetName | BorkType.SetBio | BorkType.SetAvatar
}


export interface ProfileEditProps extends AuthProps, RouteComponentProps<ProfileEditParams> {
  user: User
}

export interface ProfileEditState {
  previousValue: string
  value: string
}

class ProfileEditPage extends React.Component<ProfileEditProps, ProfileEditState> {

  constructor (props: ProfileEditProps) {
    super(props)
    this.state = {
      previousValue: props.match.params.type === BorkType.SetName ? props.user.name :
                            BorkType.SetBio ? props.user.bio :
                            BorkType.SetAvatar ? props.user.avatarLink : '',
      value: '',
    }
  }

  async componentDidMount () {
    this.props.setTitle('Edit Profile')
    this.props.setShowFab(false)
    this.setState({
      value: this.state.previousValue,
    })
  }

  handleValueChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      value: e.target.value,
    })
  }

  broadcast = () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { type } = this.props.match.params
    const { previousValue, value } = this.state

    const modal = (
      <CheckoutModal data={{ type, content: value }} />
    )

    return (
      <div className="page-content">
        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="profile-edit-form">
          <label>Value</label>
          <input type="text" value={"name"} maxLength={77} onChange={this.handleValueChange} />
          <input type="submit" value="Checkout" disabled={previousValue === value} />
        </form>
      </div>
    )
  }
}

export default withAuthContext(ProfileEditPage)
