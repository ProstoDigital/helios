import {dbid, password, map} from '@fluent-wallet/spec'
import {encrypt, decrypt} from 'browser-passworder'

export const NAME = 'wallet_deleteAccount'

export const schemas = {
  input: [map, {closed: true}, ['accountId', dbid], ['password', password]],
}

export const permissions = {
  external: ['popup'],
  methods: ['wallet_validatePassword', 'wallet_deleteAccountGroup'],
  db: ['retractAccount', 'findAccount'],
}

export const main = async ({
  Err: {InvalidParams},
  db: {findAccount, retractAccount},
  rpcs: {wallet_validatePassword, wallet_deleteAccountGroup},
  params: {accountId, password},
}) => {
  if (!(await wallet_validatePassword({password})))
    throw InvalidParams('Invalid password')

  const account = findAccount({
    accountId,
    g: {
      _accountGroup: {eid: 1, vault: {type: 1, data: 1}, account: 1},
      address: {value: 1},
    },
  })
  if (!account) throw InvalidParams(`Invalid account group id ${accountId}`)

  let ddata
  if (account.accountGroup.vault.type === 'hw') {
    ddata = await decrypt(password, account.accountGroup.vault.data)
    delete ddata[account.address[0].value]
    ddata = await encrypt(password, ddata)
  }

  if (account.accountGroup.account.length === 1) {
    return await wallet_deleteAccountGroup({
      accountGroupId: account.accountGroup.eid,
      password,
    })
  }

  retractAccount({accountId, hwVaultData: ddata})
  return true
}
