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
-v=<directory_to_which_you_cloned_cw-template>/artifacts:/var/artifacts \
--entrypoint=sh public.ecr.aws/l9h3g6c6/injective-core:staging \
-c "tail -F anything"
```

### 3. Upload the WASM Smart Contract to Testnet
```
yes 12345678 | injectived tx wasm store artifacts/my_first_contract.wasm \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--yes --fees=1000000000000000inj --gas=2000000 \
--node=https://testnet.sentry.tm.injective.network:443
```

### 4. Instantiate the Smart Contract
Replace <code_id of your stored contract> with the actual code id returned from the previous step.
```
CODE_ID=<code_id of your stored contract>
INIT='{"count":99}'

yes 12345678 | injectived tx wasm instantiate $CODE_ID $INIT \
--label="CounterTestInstance" \
--from=$(echo $INJ_ADDRESS) \
--chain-id="injective-888" \
--yes --fees=1000000000000000inj \
--gas=2000000 \
--no-admin \
--node=https://testnet.sentry.tm.injective.network:443
```
