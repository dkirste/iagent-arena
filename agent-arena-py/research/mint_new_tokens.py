import asyncio
import os

import dotenv

from pyinjective.composer import Composer as ProtoMsgComposer
from pyinjective.core.broadcaster import MsgBroadcasterWithPk
from pyinjective.core.network import Network
from pyinjective.wallet import PrivateKey
from pyinjective.proto.cosmos.base.v1beta1 import coin_pb2 as base_coin_pb


async def main() -> None:
    dotenv.load_dotenv()
    private_key_in_hexa = os.getenv("INJECTIVE_PRIVATE_KEY")
    public_address = os.getenv("INJECTIVE_PUBLIC_ADDRESS")

    # select network: local, testnet, mainnet
    network = Network.testnet()
    composer = ProtoMsgComposer(network=network.string())

    message_broadcaster = MsgBroadcasterWithPk.new_using_simulation(
        network=network,
        private_key=private_key_in_hexa,
    )

    priv_key = PrivateKey.from_hex(private_key_in_hexa)
    pub_key = priv_key.to_public_key()
    address = pub_key.to_address()

    message = composer.msg_mint(
        sender=address.to_acc_bech32(),
        amount=composer.coin(amount=10*10**18, denom="factory/inj1haezurx6zaf43frdzegku4rwjcj9nc96hde3dp/arena_test"),
        receiver=public_address
    )


    # broadcast the transaction
    result = await message_broadcaster.broadcast([message])
    print("---Transaction Response---")
    print(result)


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())