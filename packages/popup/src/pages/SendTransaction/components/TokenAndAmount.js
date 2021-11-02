import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useRPC} from '@fluent-wallet/use-rpc'
import {CaretDownFilled} from '@fluent-wallet/component-icons'
import Input from '@fluent-wallet/component-input'
import Link from '@fluent-wallet/component-link'
import Modal from '@fluent-wallet/component-modal'
import {
  CompWithLabel,
  DisplayBalance,
  SearchToken,
  TokenList,
} from '../../../components'
import {RPC_METHODS} from '../../../constants'
const {WALLETDB_HOME_PAGE_ASSETS, WALLETDB_REFETCH_BALANCE} = RPC_METHODS

const ChooseTokenList = ({open, onClose, onSelectToken}) => {
  const {t} = useTranslation()
  const {
    data: {added, native},
  } = useRPC([WALLETDB_HOME_PAGE_ASSETS], undefined, {fallbackData: {}})
  useRPC([WALLETDB_REFETCH_BALANCE])
  const homeTokenList = [native].concat(added)
  const [searchValue, setSearchValue] = useState('')
  const onChangeValue = value => {
    setSearchValue(value)
  }
  const content = (
    <div className="flex flex-col flex-1">
      <SearchToken value={searchValue} onChange={onChangeValue} />
      <span className="inline-block mt-3 mb-1 text-gray-40 text-xs">
        {t('tokenList')}
      </span>
      <TokenList tokenList={homeTokenList} onSelectToken={onSelectToken} />
    </div>
  )
  return (
    <Modal
      className="!bg-gray-circles bg-no-repeat w-80 h-[552px]"
      open={open}
      title={t('chooseToken')}
      content={content}
      onClose={onClose}
      contentClassName="flex-1 flex"
    />
  )
}

ChooseTokenList.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectToken: PropTypes.func.isRequired,
}

function TokenAndAmount({
  selectedToken,
  onChangeToken,
  amount,
  onChangeAmount,
}) {
  const {t} = useTranslation()
  const [tokenListShow, setTokenListShow] = useState(false)
  const {symbol, icon} = selectedToken
  const label = (
    <span className="flex items-center justify-between text-gray-60 w-full">
      {t('tokenAndAmount')}
      <span className="flex items-center text-xs">
        {t('available')}
        <DisplayBalance
          maxWidth={140}
          maxWidthStyle="max-w-[140px]"
          balance="10000"
          className="mx-1 text-xs"
          initialFontSize={12}
        />
        {'CFX'}
      </span>
    </span>
  )
  const onClickMax = () => {}
  return (
    <CompWithLabel label={label}>
      <div className="flex px-3 h-13 items-center justify-between bg-gray-4 border border-gray-10 rounded">
        <div
          className="flex items-center pr-3 border-r-gray-20 cursor-pointer"
          onClick={() => setTokenListShow(true)}
          aria-hidden="true"
        >
          <img
            className="w-5 h-5 mr-1"
            src={icon || '/images/default-token-icon.svg'}
            alt="logo"
          />
          <span className="text-gray-80 mr-2">{symbol}</span>
          <CaretDownFilled className="w-4 h-4 text-gray-60" />
        </div>
        <div className="flex flex-1">
          <Input
            width="w-full bg-transparent"
            bordered={false}
            value={amount}
            onChange={onChangeAmount}
          />
        </div>
        <Link onClick={onClickMax}>{t('max')}</Link>
      </div>
      <ChooseTokenList
        open={tokenListShow}
        onClose={() => setTokenListShow(false)}
        onSelectToken={onChangeToken}
      />
    </CompWithLabel>
  )
}

TokenAndAmount.propTypes = {
  selectedToken: PropTypes.object.isRequired,
  onChangeToken: PropTypes.func,
  amount: PropTypes.string,
  onChangeAmount: PropTypes.func,
}

export default TokenAndAmount
