(ns cfxjs.db.migrations.m9
  (:require
   [cfxjs.db.migutil :refer [update-version-tx]]
   [cfxjs.db.datascript.core :as d]))

(def id 9)

(defn up [old-db]
  (let [cfx-mainnet-id          (d/q '[:find ?net .
                                       :where
                                       [?net :network/builtin true]
                                       [?net :network/type "cfx"]
                                       [?net :network/chainId "0x405"]]
                                     old-db)
        change-cfx-mainnet-name {:db/id cfx-mainnet-id :network/name "Conflux Mainnet"}
        txs                     [change-cfx-mainnet-name
                                 (update-version-tx old-db id)]
        new-db                  (d/db-with old-db txs)]
    new-db))

(defn down [new-db]
  (let [cfx-mainnet-id          (d/q '[:find ?net .
                                       :where
                                       [?net :network/builtin true]
                                       [?net :network/type "cfx"]
                                       [?net :network/chainId "0x405"]]
                                     new-db)
        change-cfx-mainnet-name {:db/id cfx-mainnet-id :network/name "Conflux Mainnet"}
        txs                     [change-cfx-mainnet-name
                                 (update-version-tx new-db (dec id))]
        old-db                  (d/db-with new-db txs)]
    old-db))

(def data {:up up :down down :id id})
