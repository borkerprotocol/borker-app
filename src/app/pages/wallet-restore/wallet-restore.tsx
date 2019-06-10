import React from 'react'
import { JsWallet } from 'borker-rs-browser'
import { UnauthProps, withUnauthContext } from '../../contexts/unauth-context'
import EncryptModal from '../../components/modals/encrypt-modal/encrypt-modal'
// import { sampleWords } from '../../../util/mocks'
import '../../App.scss'
import './wallet-restore.scss'

export interface WalletRestoreProps extends UnauthProps { }

export interface WalletRestoreState {
  mnemonic: string
  wallet: JsWallet | null
  isMnemonicEntered: boolean
}

class WalletRestorePage extends React.Component<WalletRestoreProps, WalletRestoreState> {

  state = {
    wallet: null as unknown as JsWallet,
    mnemonic: '',
    isMnemonicEntered: false,
  }

  handleMnemonicChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      mnemonic: e.target.value,
      isMnemonicEntered: e.target.value.trim().replace(/ +/g, " ").split(' ').length === 12,
    })
  }

  genWallet = async (e: React.BaseSyntheticEvent) => {
    if (!this.state.wallet) {
      const borkerLib = await import('borker-rs-browser')
      const wallet = new borkerLib.JsWallet(this.state.mnemonic.trim().replace(/ +/g, " ").split(' '))
      await this.setState({ wallet })
    }

    const modal = (
      <EncryptModal newWallet={this.state.wallet} />
    )

    this.props.toggleModal(modal)
  }

  render () {
    const { isMnemonicEntered, mnemonic } = this.state

    return (
      <div className="page-content">
        <p>Insert your 12 word mnemonic phrase, separted with spaces as shown below</p>
        <textarea
          placeholder="word1 word2 word3"
          value={mnemonic}
          onChange={this.handleMnemonicChange}
          className="textarea"
        />
        <button onClick={this.genWallet} disabled={!isMnemonicEntered}>
          Restore
        </button>
      </div>
    )
  }
}

export default withUnauthContext(WalletRestorePage)
