import {defMiddleware} from '../middleware.js'
import {utils as rpcUtils} from '@cfxjs/json-rpc'
import rndId from '@cfxjs/random-id'
import * as jsonRpcErr from '@cfxjs/json-rpc-error'

export default defMiddleware(({tx: {map}}) => {
  return {
    id: 'validateAndFormatJsonRpc',
    ins: {req: {stream: '/START/node'}},
    fn: map(({req}) => {
      req.jsonrpc = req.jsonrpc || '2.0'
      req.id = req.id ?? rndId()

      if (!rpcUtils.isValidRequest(req)) {
        const err = new jsonRpcErr.InvalidRequest(
          'invalid rpc request:\n' +
            JSON.stringify(
              {params: req.params, method: req.method},
              null,
              '\t',
            ) +
            '\n',
        )
        err.rpcData = req
        throw err
      }

      return req
    }),
  }
})