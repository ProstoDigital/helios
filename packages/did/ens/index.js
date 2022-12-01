import ENSRegistryWithFallback from './abi/ENSRegistryWithFallback.json'
import Resolver from './abi/Resolver.json'
import PublicResolver from './abi/PublicResolver.json'
import Web3EthContract from 'web3-eth-contract'
import Web3EthAbi from 'web3-eth-abi'
import {hash} from '@ensdomains/eth-ens-namehash'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export default class ENS {
  provider = null
  ens = null
  PublicResolverContract
  ENSRegistryWithFallbackContract
  constructor(provider) {
    if (!provider) throw new Error('The provider is required')
    Web3EthContract.setProvider(provider)
    this._initContract()
  }

  async getName(address) {
    try {
      address = address.toLowerCase()
      const reverseStr = address.slice(2) + '.addr.reverse'
      const hashStr = hash(reverseStr)
      const resoverAddress = await this.ENSRegistryWithFallbackContract.methods
        .resolver(hashStr)
        .call()
      const resolverContract = this._getResolverContract(resoverAddress)
      const nameResult = await resolverContract.methods.name(hashStr).call()
      return nameResult.toString('hex')
    } catch (error) {
      return ''
    }
  }

  async getAddress(name) {
    const nh = hash(name)
    try {
      const resolverAddr = await this.ENSRegistryWithFallbackContract.methods
        .resolver(nh)
        .call()
      const resolverContract = this._getResolverContract(resolverAddr)
      const addr = await resolverContract.methods.addr(nh).call()
      return addr
    } catch (error) {
      return ''
    }
  }

  async getNames(addresses) {
    const proArr = []
    addresses.map(address => {
      proArr.push(this.getName(address))
    })
    const names = await Promise.all(proArr)
    const nameList = {}
    names.map((name, index) => {
      nameList[addresses[index]] = name
    })
    return nameList
  }

  async getAddresses(names) {
    const nameEncodedList = []
    names.map(name => {
      const nhItem = hash(name)
      nameEncodedList.push(
        this.PublicResolverContract.methods.addr(nhItem).encodeABI(),
      )
    })
    const addresses = {}
    try {
      const res = await this.PublicResolverContract.methods
        .multicall(nameEncodedList)
        .call()
      res.map((item, index) => {
        let address = Web3EthAbi.decodeParameter(
          'address',
          item.toString('hex'),
        )
        if (address == ZERO_ADDRESS) address = ''
        addresses[names[index]] = address
      })
    } catch (error) {
      console.warn(error)
    }

    return addresses
  }

  _initContract() {
    this.PublicResolverContract = new Web3EthContract(
      PublicResolver,
      '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    )
    this.ENSRegistryWithFallbackContract = new Web3EthContract(
      ENSRegistryWithFallback,
      '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    )
  }

  _getResolverContract(address) {
    return new Web3EthContract(Resolver, address)
  }
}
