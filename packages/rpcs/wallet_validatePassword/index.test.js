// eslint-disable-next-line no-unused-vars
import {expect, describe, test, it, jest, afterAll, afterEach, beforeAll, beforeEach} from '@jest/globals' // prettier-ignore
import {main, schemas} from './'
import {encrypt} from 'browser-passworder'
import {validate} from '@fluent-wallet/spec'

describe('wallet_validatePassword', function () {
  describe('main', function () {
    let vault, input
    beforeAll(async () => {
      vault = {type: 'pk', data: await encrypt('11111111', 'foo')}
      input = {
        params: {password: '00000000'},
        db: {
          getVault: () => [vault],
          getLocked: () => true,
          getPassword: jest.fn(),
        },
      }
    })

    it('should return false with invalid password', async function () {
      const valid = await main(input)
      expect(valid).toBe(false)
    })

    it('should return true with valid password', async function () {
      input.params.password = '11111111'
      const valid = await main(input)
      expect(valid).toBe(true)
    })

    it('should return true with no vault', async function () {
      input.params.password = '11111111'
      input.db.getVault = jest.fn(() => [])
      const valid = await main(input)
      expect(valid).toBe(true)
      expect(input.db.getVault).toHaveBeenCalled()
    })
  })

  describe('schema', function () {
    it('should validate the input password', async function () {
      expect(validate(schemas.input, {password: '11111111'})).toBe(true)
      expect(validate(schemas.input, {password: '11111111', noise: true})).toBe(
        false,
      )
      expect(validate(schemas.input, {password: '111'})).toBe(false)
    })
  })
})
