import {iface} from '@fluent-wallet/contract-abis/777.js'

export const getEthContractMethodSignature = async transactionData => {
  return iface.parseTransaction({data: transactionData})
}
