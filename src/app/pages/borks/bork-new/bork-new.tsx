import React from 'react'
import { RouteComponentProps } from 'react-router'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import BorkComponent from '../../../components/bork/bork'
import WebService from '../../../web-service'
import { BorkType, Bork } from '../../../../types/types'
import './bork-new.scss'
import '../../../App.scss'

export interface NewBorkParams {
  txid: string
}

export interface NewBorkProps extends AuthProps, RouteComponentProps<NewBorkParams> {} 

export interface NewBorkState {
  body: string
  parent: Bork | undefined
}

class NewBorkPage extends React.Component<NewBorkProps, NewBorkState> {
  public webService: WebService

  constructor (props: NewBorkProps) {
    super(props)
    this.state ={
      body: '',
      parent: undefined,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('New Bork')
    this.props.setShowFab(false)

    if (this.props.match.params.txid) {
      this.setState({
        parent: await this.webService.getBork(this.props.match.params.txid),
      })
    }
  }

  handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: e.target.value,
    })
  }

  render () {
    const { body, parent } = this.state
    const charCount = body.length
    const txCount = charCount === 0 ? 0 : charCount > 77 ? Math.ceil(1 + (charCount - 77) / 76) : 1

    const modal = (
      <CheckoutModal type={parent ? BorkType.comment : BorkType.bork} txCount={txCount} />
    )

    return (
      <div className="page-content">
        {parent &&
          <div className="commenting-on">
            <b>Commenting On:</b>
            <BorkComponent isMain={false} showButtons={false} bork={parent} />
          </div>
        }
        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="bork-form">
          <textarea value={body} onChange={this.handleBodyChange} />
          <input type="submit" value="Preview" disabled={!charCount} />
        </form>
        <p>Character Count: {charCount}</p>
        <p>Transaction Count: {txCount}</p>
      </div>
    )
  }
}

export default withAuthContext(NewBorkPage)