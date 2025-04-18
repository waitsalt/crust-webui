import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot, crustTypes } from "@crustio/type-definitions";
import { Keyring } from "@polkadot/keyring";
import { useSettingStore } from "@/store/setting";

const crustChainEndpoint = "wss://rpc.crust.network";
const api = new ApiPromise({
  provider: new WsProvider(crustChainEndpoint),
  typesBundle: typesBundleForPolkadot,
});

async function order(cid: string, size: number) {
  const tx = api.tx.market.placeStorageOrder(cid, size + 1024 * 2, 0, "");

  const seed = useSettingStore().setting.user.seed;
  const kr = new Keyring({ type: "sr25519" });
  const krp = kr.addFromUri(seed);

  await api.isReadyOrError;
  const res = await api.query.market.files(cid);
  console.log(res);
  return
  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({ events = [], status }) => {
      console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`);

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (method === "ExtrinsicSuccess") {
            console.log(`✅  Place storage order success!`);
            resolve(true);
          }
        });
      } else {
        // Pass it
      }
    }).catch((e) => {
      reject(e);
    });
  });
}

export { order };
