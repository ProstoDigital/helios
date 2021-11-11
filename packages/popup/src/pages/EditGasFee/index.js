import {useState, useEffect} from 'react'
import {useEffectOnce} from 'react-use'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import Button from '@fluent-wallet/component-button'
import {TitleNav, DisplayBalance, NumberInput} from '../../components'
import {useNetworkTypeIsCfx} from '../../hooks/useApi'
import {useTxParams, useEstimateTx} from '../../hooks'
import {WrapperWithLabel} from './components'
import {
  GWEI_DECIMALS,
  Big,
  formatDecimalToHex,
  formatHexToDecimal,
  fromDripToCfx,
  convertDecimal,
  CFX_DECIMALS,
  convertDataToValue,
} from '@fluent-wallet/data-format'
import useGlobalStore from '../../stores'

function EditGasFee() {
  const {t} = useTranslation()
  const history = useHistory()
  const [gasPriceErr, setGasPriceErr] = useState('')
  const [gasLimitErr, setGasLimitErr] = useState('')
  const [nonceErr, setNonceErr] = useState('')
  const [inputGasPrice, setInputGasPrice] = useState('0')
  const [inputGasLimit, setInputGasLimit] = useState('0')
  const [inputNonce, setInputNonce] = useState('0')
  const {gasPrice, gasLimit, nonce, setGasPrice, setGasLimit, setNonce} =
    useGlobalStore()

  const networkTypeIsCfx = useNetworkTypeIsCfx()
  const symbol = networkTypeIsCfx ? 'CFX' : 'ETH'

  const params = {
    ...useTxParams(),
    gasPrice: formatDecimalToHex(gasPrice),
    gasLimit: formatDecimalToHex(gasLimit),
    nonce: formatDecimalToHex(nonce),
  }
  console.log('params', params)
  const estimateRst = useEstimateTx(params) || {}
  console.log('estimateRst = ', estimateRst)
  const {gasUsed, storageFeeDrip, storageCollateralized} = estimateRst

  //TODO:  if not pass transition params  jump to home
  // if () {
  //   history.push(HOME)
  // }

  useEffectOnce(() => {
    setInputGasLimit(gasUsed)
    setInputGasPrice(gasPrice)
    setInputNonce(nonce)
  }, [gasUsed, gasPrice, nonce])

  const gasFee = networkTypeIsCfx
    ? new Big(fromDripToCfx(gasPrice)).times(gasLimit).toString(10)
    : new Big(convertDecimal(gasPrice, 'divide', GWEI_DECIMALS))
        .times(gasLimit)
        .toString(10)

  const storageFee = convertDataToValue(storageFeeDrip, CFX_DECIMALS)
  const txFee = new Big(gasFee).plus(storageFee || 0).toString(10)

  useEffect(() => {
    setGasPriceErr(
      new Big(inputGasPrice).gt(0)
        ? ''
        : t('gasPriceErrMSg', {
            unit: networkTypeIsCfx ? t('drip') : t('gWei'),
          }),
    )
  }, [inputGasPrice, networkTypeIsCfx, t])

  useEffect(() => {
    setGasLimitErr(
      new Big(inputGasLimit).gte(formatHexToDecimal(gasUsed))
        ? ''
        : t('gasLimitErrMsg', {
            gasUsed: formatHexToDecimal(gasUsed),
          }),
    )
  }, [inputGasLimit, gasUsed, t])

  useEffect(() => {
    setNonceErr(new Big(inputNonce).gt(0) ? '' : t('nonceErr'))
  }, [inputNonce, t])

  const saveGasData = () => {
    setGasPrice(inputGasPrice)
    setGasLimit(inputGasLimit)
    setNonce(inputNonce)
    history.goBack()
  }

  return (
    <div
      id="editGasFeeContainer"
      className="h-full flex flex-col bg-blue-circles bg-no-repeat bg-bg"
    >
      <div className="flex-1">
        <TitleNav title={t('editGasFeeControl')} />
        <main className="mt-3">
          <WrapperWithLabel
            leftContent={t('gasFee')}
            containerClass="mb-3"
            rightClass="text-gray-80"
            rightContent={
              <DisplayBalance
                maxWidth={218}
                maxWidthStyle="max-w-[218px]"
                symbol={symbol}
                balance={gasFee}
              />
            }
          />
          <WrapperWithLabel
            containerClass={`${gasPriceErr ? 'mb-9' : 'mb-3'} relative`}
            leftContent={`${t('gasPrice')} (${
              networkTypeIsCfx ? '(Drip)' : '(GWei)'
            })`}
            rightContent={
              <NumberInput
                size="small"
                width="w-32"
                value={gasPrice}
                errorMessage={gasPriceErr}
                errorClassName="absolute right-0 -bottom-6"
                onChange={e => setInputGasPrice(e.target.value)}
              />
            }
          />
          <WrapperWithLabel
            leftContent={t('gasLimit')}
            containerClass={`${gasLimitErr ? 'mb-9' : 'mb-3'} relative`}
            rightContent={
              <NumberInput
                size="small"
                width="w-32"
                errorClassName="absolute right-0 -bottom-6"
                value={inputGasLimit}
                errorMessage={gasLimitErr}
                onChange={e => setInputGasLimit(e.target.value)}
              />
            }
          />
          {networkTypeIsCfx ? (
            <div>
              <WrapperWithLabel
                leftContent={t('storageFee')}
                containerClass="mb-3"
                rightClass="text-gray-80"
                rightContent={
                  <DisplayBalance
                    maxWidth={218}
                    maxWidthStyle="max-w-[218px]"
                    symbol={symbol}
                    balance={storageFee}
                  />
                }
              />
              <WrapperWithLabel
                leftContent={t('storageCollateralized')}
                rightClass="text-gray-80"
                rightContent={formatHexToDecimal(storageCollateralized)}
              />
            </div>
          ) : null}
          <div className="bg-gray-20 h-px mx-3 my-4" />
          {networkTypeIsCfx ? (
            <WrapperWithLabel
              leftContent={t('totalFee')}
              containerClass="mb-10"
              leftClass="text-gray-80"
              rightClass="text-gray-80 text-base"
              rightContent={
                <DisplayBalance
                  maxWidth={218}
                  maxWidthStyle="max-w-[218px]"
                  symbol={symbol}
                  initialFontSize={16}
                  balance={txFee}
                />
              }
            />
          ) : null}

          <WrapperWithLabel
            leftContent={t('customNonce')}
            containerClass="relative"
            rightContent={
              <NumberInput
                size="small"
                width="w-32"
                value={inputNonce}
                errorMessage={nonceErr}
                errorClassName="absolute right-0 -bottom-6"
                onChange={e => setInputNonce(e.target.value)}
              />
            }
          />
        </main>
      </div>
      <footer>
        <Button
          className="w-70  mx-auto mb-9"
          id="saveGasFeeBtn"
          onClick={saveGasData}
          disabled={!!gasPriceErr || !!nonceErr || !!gasLimitErr}
        >
          {t('save')}
        </Button>
      </footer>
    </div>
  )
}

export default EditGasFee
