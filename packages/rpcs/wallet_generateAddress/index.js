import {or, map, networkId, addressType, truep} from '@fluent-wallet/spec'
import {randomBase32Address} from '@fluent-wallet/base32-address'
import {randomHexAddress, randomCfxHexAddress} from '@fluent-wallet/account'

export const NAME = 'wallet_generateAddress'

const base = [map, {closed: true}]
const hex = ['hex', truep]
const base32 = ['base32', truep]
const addrType = ['type', addressType]
const cfx = ['cfx', {optional: true}, truep]
const ethAddressSchema = [...base, hex, ['eth', truep]]
const cfxHexAddressSchema = [...base, hex, cfx, addrType]
const cfxBase32AddressSchema = [
  ...base,
  base32,
  cfx,
  addrType,
  ['networkId', networkId],
]

export const schemas = {
  input: [or, ethAddressSchema, cfxHexAddressSchema, cfxBase32AddressSchema],
}
export const permissions = {
  locked: true,
  external: ['popup'],
}

const genRandomCfxHexAddress = type => {
  if (!type) return randomCfxHexAddress()
  return randomHexAddress(type)
}

export const main = function ({params: {eth, base32, hex, networkId, type}}) {
  if (eth) return randomHexAddress()
  if (hex) return genRandomCfxHexAddress(type)
  if (base32) return randomBase32Address(type, networkId)
}
