import {useState} from 'react'
import {useRPC} from '@fluent-wallet/use-rpc'
import {useTranslation} from 'react-i18next'
import {AuthorizeModal, DisconnectModal} from '../components'
import {request} from '../../../utils'
import useGlobalStore from '../../../stores/index.js'
import {RPC_METHODS} from '../../../constants'
const {GET_CURRENT_DAPP, GET_CURRENT_ACCOUNT, REQUEST_PERMISSIONS, DELETE_APP} =
  RPC_METHODS

function CurrentDapp() {
  const {t} = useTranslation()
  const {setFatalError} = useGlobalStore()
  const [authModalShow, setAuthModalShow] = useState(false)
  const [disconnectModalShow, setDisconnectModalShow] = useState(false)
  const {data} = useRPC([GET_CURRENT_DAPP], undefined, {
    fallbackData: {},
  })
  const site = data?.site || {}
  const currentDapp = data?.app || {}
  const {currentAccount: dappCurrentAccount, eid: appId} = currentDapp
  const {data: currentAccount} = useRPC([GET_CURRENT_ACCOUNT], undefined, {
    fallbackData: {},
  })
  const {origin, icon, eid: siteId} = site
  const {nickname: connectedNickname, eid: connectedEid} =
    dappCurrentAccount || {}
  const {nickname: currentNickname, eid: currentEid} = currentAccount
  const isConnected = !!data?.app
  const isConnectedCurrentAccount = connectedEid === currentEid

  const onAuth = () => {
    request(REQUEST_PERMISSIONS, {
      siteId,
      permissions: [{wallet_accounts: {}}],
      accounts: [currentEid],
    }).then(({error}) => {
      if (error) setFatalError(error)
      else setAuthModalShow(false)
    })
  }

  const onDisconnect = () => {
    request(DELETE_APP, {appId}).then(({error}) => {
      if (error) setFatalError(error)
      else setDisconnectModalShow(false)
    })
  }

  return (
    <div className="flex items-center h-16 rounded-t-xl bg-gray-0 px-3">
      {!isConnected && (
        <span className="text-gray-40">{t('noConnectedDapp')}</span>
      )}
      {isConnected && (
        <>
          <div className="flex items-center justify-center border border-gray-20 w-8 h-8 rounded-full mr-2">
            <img className="w-6 h-6" src={icon} alt="logo" />
          </div>
          <div className="flex flex-col flex-1 items-center">
            <div className="flex w-full items-center justify-between mb-0.5">
              <span className="text-gray-80 font-medium inline-block">
                {origin}
              </span>
              <span className="text-gray-60 text-xs inline-block mb-1">
                {connectedNickname}
              </span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span
                className="h-5 px-2 bg-primary-4 rounded-full text-success text-xs flex items-center justify-center cursor-pointer"
                aria-hidden="true"
                onClick={() => setDisconnectModalShow(true)}
              >
                <span className="w-1 h-1 rounded-full bg-success border border-gray-0 box-content mr-1" />
                {t('connected')}
              </span>
              {!isConnectedCurrentAccount ? (
                <span
                  className="text-primary text-xs cursor-pointer"
                  onClick={() => setAuthModalShow(true)}
                  aria-hidden="true"
                >
                  {t('authorizeCurrentAccount', {
                    currentAccount: currentNickname,
                  })}
                </span>
              ) : (
                <span />
              )}
            </div>
            <AuthorizeModal
              open={authModalShow}
              onClose={() => setAuthModalShow(false)}
              needAuthAccountName={currentNickname}
              onAuth={onAuth}
            />
            <DisconnectModal
              open={disconnectModalShow}
              onClose={() => setDisconnectModalShow(false)}
              onDisconnect={onDisconnect}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CurrentDapp