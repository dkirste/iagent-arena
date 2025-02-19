from typing import Dict
from injective_functions.base import InjectiveBase
from injective_functions.utils.helpers import detailed_exception_info




class WasmFactory(InjectiveBase):
    def __init__(self, chain_client) -> None:
        # Initializes the network and the composer
        super().__init__(chain_client)

    async def dojo_swap_agent_token_in(self, tokencontract: str, paircontract: str, amount: int, decimals: int) -> Dict:

        # def MsgExecuteContract(self, sender: str, contract: str, msg: str, **kwargs):
        # return wasm_tx_pb.MsgExecuteContract(
        #     sender=sender,
        #     contract=contract,
        #     msg=bytes(msg, "utf-8"),
        #     funds=kwargs.get("funds")  # funds is a list of base_coin_pb.Coin.
        #     # The coins in the list must be sorted in alphabetical order by denoms.
        # )
        try:
            await self.chain_client.init_client()
            msg = self.chain_client.composer.MsgExecuteContract(
                sender=self.chain_client.address.to_acc_bech32(),
                contract=tokencontract,
                msg=f'{"send": { "contract": "{paircontract}", "amount": "{amount*10**decimals}", "msg": "eyJzd2FwIjp7fX0="}}',
                funds=added_funds, # Add the token that is being sent
            )

            # broadcast the transaction
            res = await self.chain_client.message_broadcaster.broadcast([msg])
            return {"success": True, "result": res}
        except Exception as e:
            return {"success": False, "error": detailed_exception_info(e)}
