import {base32ContractAddress, cat, epochRefNoMined} from '@fluent-wallet/spec'

export const NAME = 'cfx_getCode'

export const cache = {
  type: 'epoch',
  ttl: 3600,
  key: ({params}) => `${NAME}${params[0]}`,
}

export const schemas = {
  input: [cat, base32ContractAddress, epochRefNoMined],
}

export const permissions = {
  locked: true,
  external: ['popup', 'inpage'],
}

export const main = async ({f, params}) => {
  return await f(params)
}
