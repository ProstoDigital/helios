import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {CloseCircleFilled} from '@fluent-wallet/component-icons'
import Button from '@fluent-wallet/component-button'
import Loading from '@fluent-wallet/component-loading'
import Modal from '@fluent-wallet/component-modal'
import useGlobalStore from '../../../stores'
import {ROUTES, HW_TX_STATUS} from '../../../constants'
const {HOME} = ROUTES

function HwTransactionResult({status}) {
  const {t} = useTranslation()
  const history = useHistory()
  const {clearSendTransactionParams} = useGlobalStore()
  const isRejected = status === HW_TX_STATUS.REJECTED
  const open = status && status !== HW_TX_STATUS.SUCCESS
  const title = isRejected ? t('rejected') : t('waitingForSign')
  const content = isRejected ? t('rejectedContent') : t('waitingContent')
  return (
    <Modal
      open={open}
      closable={false}
      title={title}
      content={content}
      icon={
        isRejected ? <CloseCircleFilled className="text-error" /> : <Loading />
      }
      actions={
        isRejected ? (
          <Button
            fullWidth={true}
            onClick={() => {
              clearSendTransactionParams()
              history.push(HOME)
            }}
          >
            {t('ok')}
          </Button>
        ) : null
      }
    />
  )
}

HwTransactionResult.propTypes = {
  status: PropTypes.oneOf(Object.keys(HW_TX_STATUS)).isRequired,
}

export default HwTransactionResult