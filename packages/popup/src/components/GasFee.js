import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import Link from '@fluent-wallet/component-link'
import {
  Big,
  fromDripToCfx,
  convertDecimal,
  GWEI_DECIMALS,
} from '@fluent-wallet/data-format'
import {RightOutlined} from '@fluent-wallet/component-icons'
import {CompWithLabel, DisplayBalance, CustomTag} from '../components'
import {useNetworkTypeIsCfx} from '../hooks/useApi'
import useGlobalStore from '../stores'
import {ROUTES} from '../constants'
const {EDIT_GAS_FEE} = ROUTES

function GasFee({storageFee, willPayCollateral, willPayTxFee}) {
  const {t} = useTranslation()
  const history = useHistory()
  const {gasLimit, gasPrice} = useGlobalStore()
  const networkTypeIsCfx = useNetworkTypeIsCfx()
  const isBePayed = (!willPayCollateral || !willPayTxFee) && storageFee
  const isBeAllPayed = !willPayCollateral && !willPayTxFee
  console.log(gasPrice, gasLimit, storageFee)
  const gasFee = networkTypeIsCfx
    ? new Big(fromDripToCfx(gasPrice)).times(gasLimit).toString(10)
    : new Big(convertDecimal(gasPrice, 'divide', GWEI_DECIMALS))
        .times(gasLimit)
        .toString(10)
  const realPayedFee = isBeAllPayed
    ? '0'
    : !willPayCollateral
    ? gasFee
    : storageFee
  const txFee = new Big(gasFee).plus(storageFee || 0).toString(10)
  console.log(gasFee, storageFee, txFee, realPayedFee)

  const label = (
    <span className="flex items-center justify-between w-full">
      {t('gasFee')}
      <span className="flex items-center">
        <Link onClick={() => history.push(EDIT_GAS_FEE)}>
          {t('edit')}
          <RightOutlined className="w-3 h-3 text-primary ml-1" />
        </Link>
      </span>
    </span>
  )
  return (
    <CompWithLabel label={label}>
      <div className="flex flex-col bg-gray-4 border-gray-10 rounded px-2 py-3 relative">
        <DisplayBalance
          balance={realPayedFee}
          maxWidth={234}
          maxWidthStyle="max-w-[234px]"
          className="text-base mb-0.5"
          symbol={networkTypeIsCfx ? 'CFX' : 'ETH'}
          initialFontSize={16}
        />
        <DisplayBalance
          balance={txFee}
          maxWidth={300}
          maxWidthStyle="max-w-[300px]"
          className="!text-gray-40 line-through !font-normal mb-0.5"
          symbol={networkTypeIsCfx ? 'CFX' : 'ETH'}
        />
        <span className="text-xs text-gray-60">{`${gasPrice} ${
          networkTypeIsCfx ? 'Drip' : 'Gwei'
        }`}</span>
        {isBePayed && (
          <CustomTag
            width="w-15"
            textColor="text-white"
            backgroundColor="bg-[#44d7b6]"
            className="absolute right-0 top-0"
          >
            <span className="text-2xs text-white">{t('sponsored')}</span>
          </CustomTag>
        )}
      </div>
    </CompWithLabel>
  )
}

GasFee.propTypes = {
  storageFee: PropTypes.string,
  willPayCollateral: PropTypes.bool,
  willPayTxFee: PropTypes.bool,
}

export default GasFee
