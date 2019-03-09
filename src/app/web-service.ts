import rp from 'request-promise'
import * as Storage from 'idb-keyval'
import BigNumber from 'bignumber.js'
import { BorkType, User, Bork, Utxo } from '../types/types'
import { FollowsType } from './pages/user-list/user-list'
import { UserFilter } from './pages/explore/explore'
import { BorkerConfig } from './pages/settings/settings'

class WebService {

  constructor () {}

  async getTxFee (): Promise<BigNumber> {
    return new BigNumber(1)
  }

  async getBalance (): Promise<BigNumber> {
    const options: rp.Options = {
      method: 'GET',
      url: `/users/me/balance`,
    }

    const res = await this.request(options)
    return new BigNumber(res)
  }

  async getUtxos (): Promise<Utxo[]> {
    const options: rp.Options = {
      method: 'GET',
      url: `/users/me/utxos`,
    }

    return this.request(options)
  }

  async getUsers (filter: UserFilter): Promise<User[]> {

    const options: rp.Options = {
      method: 'GET',
      url: `/users`,
      qs: { filter },
    }

    return this.request(options)
  }

  async getUsersByTx (txid: string, type: BorkType.rebork | BorkType.like | BorkType.flag): Promise<User[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/transactions/${txid}/users`,
      qs: { type },
    }

    return this.request(options)
  }

  async getUsersByUser (address: string, type: FollowsType): Promise<User[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/users/${address}/users`,
      qs: { type },
    }

    return this.request(options)
  }

  async getUser (address: string): Promise<User> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/users/${address}`,
    }

    return this.request(options)
  }

  async getBork (txid: string): Promise<Bork> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/transactions/${txid}`,
    }

    return this.request(options)
  }

  async getBorks (params: IndexTxParams = {}): Promise<Bork[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: '/transactions',
      qs: params,
    }

    return this.request(options)
  }
  
  async getProfileUpdates (senderAddress: string): Promise<Bork[]> {
    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: '/transactions',
      qs: {
        senderAddress,
        types: [BorkType.setName, BorkType.setBio, BorkType.setAvatar],
      },
    }

    return this.request(options)
  }

  private async request (options: rp.OptionsWithUrl) {

    const [config, address] = await Promise.all([
      Storage.get<BorkerConfig>('borkerconfig'),
      Storage.get<string>('address'),
    ])

    if (!config || !config.externalip) {
      alert('please go to "Settings" and provide an IP address of a Borker node.')
      return
    }

    Object.assign(options, {
      url: config.externalip + options.url,
      headers: { 'my-address': address },
    })

    try {

      const res = JSON.parse(await rp(options))
      console.log(res)
      return res

    } catch (err) {

      console.error(err)
      alert(err)
    }
  }
}

export default WebService

export interface Response {
  result: string
  error: string | null
  id: string
}

export interface IndexParams {
  page?: number
  perPage?: number
}

export interface IndexTxParams extends IndexParams {
  filterFollowing?: boolean
  senderAddress?: string
  parentTxid?: string
  types?: BorkType[]
}
