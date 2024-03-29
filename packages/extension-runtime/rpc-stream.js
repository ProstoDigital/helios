import {stream, pubsub} from '@thi.ng/rstream'

const s = stream({
  cache: false,
  closeIn: false,
  closeOut: false,
})

const pb = pubsub({topic: ({id} = {}) => id})
s.subscribe(pb)

export const rpcStream = port => {
  port.onMessage.addListener(s.next.bind(s))
  return {
    stream: s,
    send(req) {
      const result = new Promise(resolve => {
        pb.subscribeTopic(req.id, {
          next: rst => {
            pb.unsubscribeTopic(req.id)
            if (rst?.result === '__null__') rst.result = null
            resolve(rst)
          },
        })
      })
      port.postMessage(req)
      return result
    },
  }
}
