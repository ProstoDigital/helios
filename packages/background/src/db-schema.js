/*
  Documentation about db schema

  - identity: true (default to false)
  Means there will no duplicate records of the same attribute with same value,
  eg. `:account/ethHexAddress` has the 'identity: true', so that there will only
  be one account if you run `db.createAccount({ethHexAddress: 1})` twice, cause
  they are the same account.
  https://docs.datomic.com/on-prem/schema/identity.html#unique-identities

  - value: true (default to false)
  Same as identity: true, but will throw a error if try to insert the same attribute
  twice. https://docs.datomic.com/on-prem/schema/identity.html#unique-values

  - persist: false (default to true)
  Means the attribute won't be available in the result of `SerializeToStr(db)`.
  Note that this is a custom implementation in this project.

  - ref: true (default to false)
  Means this attribute is a reference to another entity.

  - component: true (default to false)
  Means this attribute is the representation of an entity and it's one of the
  children of the parent entity.
  */
const schema = {
  /*
    vault, container of credential (address/pk/mnemonic)
    */
  vault: {
    type: {doc: 'Type of vault: public, pk, mnemonic'},
    data: {doc: 'Encrypted vault data'},
    ddata: {doc: 'Decrypted vault data only in memory', persist: false},
    cfxOnly: {
      doc: 'If this vault is only for conflux chain. This is used for address vault (vault data is a public address)',
    },
    addresses: {
      doc: 'Addresses belong to this vault',
      many: true,
      ref: true,
      component: true,
    },
  },
  hdpath: {
    value: {value: true},
    name: {value: true},
  },
  network: {
    name: {
      value: true,
      doc: "Name of a network, used as id of network, builtin network name can't be changed, reload(reinit) the extension if network name changed",
    },
    endpoint: {
      value: true,
      doc: "RPC endpoint of a network, can't be duplicate",
    },
    type: {
      doc: "One of 'cfx'/'eth', indicating type of rpc set of this network",
    },
    hdpath: {ref: true},
    chainId: {doc: 'Network chain id'},
    netId: {doc: 'Network id'},
    ticker: {doc: 'Network currency symbol'},
  },
  address: {
    network: {ref: true},
    vault: {ref: true, doc: 'Entity ID of vault'},
    hdpath: {ref: true, doc: 'Entity ID of hd path'},
    index: {doc: 'Address index in hd path'},
    hex: {doc: 'The vaule of the address, not cfx hex address'},
    cfxHex: {doc: 'The value of cfx hex address'},
    base32Mainnet: {doc: 'cfx mainnet base32 address'},
    pk: {doc: 'the private key of the address', persist: false},
  },
  account: {
    index: {
      doc: 'index of account in account group',
    },
    nickname: {
      doc: 'account nickname',
    },
    accountGroup: {ref: true},
    addresses: {
      ref: true,
      many: true,
    },
    hidden: {
      doc: 'If hide this account in ui',
    },
  },
  accountGroup: {
    vault: {ref: true, doc: 'Entity ID of vault'},
    nickname: {value: true},
    supportedNetworks: {
      ref: true,
      many: true,
      doc: 'Used to filter account group based on network, so that user can hide specific account group by network',
    },
    customHdpath: {
      ref: true,
      doc: 'Entity ID of hd path, when set, will use this custom hd path for whatever network',
    },
    hidden: {
      doc: 'If hide this accountGroup in ui',
    },
  },
}

export default schema
