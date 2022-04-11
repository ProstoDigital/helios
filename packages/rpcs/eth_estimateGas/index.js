import * as spec from '@fluent-wallet/spec'
import genEthTxSchema from '@fluent-wallet/eth-transaction-schema'

const {blockRef, zeroOrOne} = spec

const {
  TransactionLegacyUnsigned,
  Transaction1559Unsigned,
  Transaction2930Unsigned,
} = genEthTxSchema(spec)

export const NAME = 'eth_estimateGas'

export const schemas = {
  input: [
    spec.cat,
    [
      spec.or,
      TransactionLegacyUnsigned.map(k =>
        Array.isArray(k) ? spec.optionalMapKey(k) : k,
      ),
      Transaction1559Unsigned.map(k =>
        Array.isArray(k) ? spec.optionalMapKey(k) : k,
      ),
      Transaction2930Unsigned.map(k =>
        Array.isArray(k) ? spec.optionalMapKey(k) : k,
      ),
    ],
    [zeroOrOne, blockRef],
  ],
}

export const permissions = {
  external: ['popup', 'inpage'],
  locked: true,
}

export const main = async ({f, params}) => {
  let [tx, ref] = params
  ref = ref || 'latest'
  // network without EIP-1559 support may throw error when estimate with `type`
  if (tx.type === '0x0' || tx.type === null) {
    // eslint-disable-next-line no-unused-vars
    const {type, ...newTx} = tx
    tx = newTx
  }
  return await f([tx, ref])
}
