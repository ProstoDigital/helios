import PropTypes from 'prop-types'
import {useState} from 'react'
import QRCode from 'qrcode.react'
import Modal from '@fluent-wallet/component-modal'
import {QrcodeOutlined} from '@fluent-wallet/component-icons'
import {WrapIcon} from './index'

function QRCodeButton({
  title,
  qrcodeValue,
  className = '',
  wrapperClassName = '',
}) {
  const [qrcodeShow, setQrcodeShow] = useState(false)
  const icon = (
    <QrcodeOutlined
      onClick={() => setQrcodeShow(true)}
      className={`cursor-pointer w-4 h-4 text-white ${className}`}
      id="qrCodeOutlined"
    />
  )
  return (
    <>
      {wrapperClassName ? (
        <WrapIcon className={wrapperClassName}>{icon}</WrapIcon>
      ) : (
        icon
      )}

      <Modal
        open={qrcodeShow}
        onClose={() => setQrcodeShow(false)}
        content={
          <div className="flex flex-col items-center" id="qrContent">
            <span className="text-gray-40 text-xs mb-1">{title}</span>
            <QRCode value={qrcodeValue} size={272} />
            <span className="inline-block w-full mt-2 bg-bg rounded p-2 text-gray-80 break-all">
              {qrcodeValue}
            </span>
          </div>
        }
      />
    </>
  )
}

QRCodeButton.propTypes = {
  title: PropTypes.string,
  qrcodeValue: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
}

export default QRCodeButton
