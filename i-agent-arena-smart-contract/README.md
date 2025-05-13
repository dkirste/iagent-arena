# iAgentArena Smart Contract

## Deployment

### 1. Compile the Smart Contract
This step compiles your smart contract using the CosmWasm optimizer to produce an optimized wasm binary.
```
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.12
```

### 2. Create the Injective Docker Container
```
docker run --name="injective-core-staging" \
-v=$(pwd)/artifacts:/var/artifacts \
--entrypoint=sh public.ecr.aws/l9h3g6c6/injective-core:staging \
-c "tail -F anything"
```

### 3. Get a Bash Shell in the Container
```
docker exec -it injective-core-staging sh
apk add jq
injectived keys add iagentarena

INJ_ADDRESS=inj154l429ac75spgac6qqdyxs0dtthy25l25r6q9q
cd /var
```

### 4. Upload the WASM Smart Contract to Testnet
```
yes 12345678 | injectived tx wasm store artifacts/cw20_bonding.wasm \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--yes --fees=10000000000000000inj --gas=20000000 \
--node=https://testnet.sentry.tm.injective.network:443
```

### 5. Instantiate the Smart Contract
Replace <code_id of your stored contract> with the actual code id returned from the previous step.
```
CODE_ID=<code_id of your stored contract>
INIT='{"name":"ALPHA","symbol":"ALPHA","decimals":6,"reserve_denom":"inj","reserve_decimals":6,"curve_type":{"linear":{"slope":"1","scale":1}}}'

yes 12345678 | injectived tx wasm instantiate $CODE_ID $INIT \
--label="iAgentArenaTest" \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--yes --fees=10000000000000000inj \
--gas=20000000 \
--no-admin \
--node=https://testnet.sentry.tm.injective.network:443
```


## Interacting with the smart contract

### 1. Query Balance 
```
CONTRACT_ADDRESS=inj12g9jfpjmd3xk2k3zel3hky75lve3w82u5hp5rq

injectived q wasm contract-state smart $(echo $CONTRACT_ADDRESS) \
'{"balance": {"address": "inj154l429ac75spgac6qqdyxs0dtthy25l25r6q9q"}}' \
--node=https://testnet.sentry.tm.injective.network:443 \
--output json
```

### 2. Query Curve Info
```
injectived q wasm contract-state smart $(echo $CONTRACT_ADDRESS) \
'{"curve_info": {}}' \
--node=https://testnet.sentry.tm.injective.network:443 \
--output json
```


### 3. Buy Tokens 
```
injectived tx wasm execute $(echo $CONTRACT_ADDRESS) \
'{"buy": {}}' \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--amount="1000000000000000000inj" \
--yes --fees=10000000000000000inj --gas=20000000 \
--node=https://testnet.sentry.tm.injective.network:443
```

### 4. Sell Tokens 
```
injectived tx wasm execute $(echo $CONTRACT_ADDRESS) \
'{"burn": {"amount": "10"}}' \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--yes --fees=10000000000000000inj --gas=20000000 \
--node=https://testnet.sentry.tm.injective.network:443
```



