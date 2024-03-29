import {base32UserAddress, cat, epochRefNoMined} from '@fluent-wallet/spec'

export const NAME = 'cfx_getCollateralForStorage'

export const schemas = {
  input: [cat, base32UserAddress, epochRefNoMined],
}

export const permissions = {
  external: ['popup', 'inpage'],
  locked: true,
}

export const cache = {
  type: 'epoch',
  key: ({params}) => `${NAME}${params[0]}`,
}

export const main = ({f, params}) => {
  return f(params)
}
