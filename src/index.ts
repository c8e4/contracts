import { compile } from "@fleet-sdk/compiler"
import { AddressType, ErgoAddress, Network, SByte, SColl, SGroupElement, SInt, SLong, SSigmaProp } from "@fleet-sdk/core"
import { stringToBytes } from "@scure/base";
//import { hodlContract } from "./hodlContract";
import { saleContract } from "./saleContract";
enum SigmaTypeCode {
    Boolean = 1,
    Byte = 2,
    Short = 3,
    Int = 4,
    Long = 5,
    BigInt = 6,
    GroupElement = 7,
    SigmaProp = 8,
    Coll = 12,
    NestedColl = 24,
    Option = 36,
    OptionColl = 48,
    Tuple2 = 60,
    Tuple3 = 72,
    Tuple4 = 84,
    TupleN = 96,
    Any = 97,
    Unit = 98,
    Box = 99,
    AvlTree = 100,
    Context = 101,
    Header = 104,
    PreHeader = 105,
    Global = 106
}

//const myPK = '3WzKBx27Es2qsZAemEuAWExRHvEXJ63yBCGJrpHvYmvk4mCQssoM'
const devPK = '9fjaoqKoTtuFUZMmkeA7quf2WotQwsq8EUYK5ZfCvZjCqWaW5B8'
const hodlerPK = devPK;

function comp() {
    const tree = compile(saleContract
    //    , {
    //    map: {
    //        $oraclePoolNFT: SColl(SByte, stringToBytes("utf8", devPK)),
    //        $contractDevPK: SSigmaProp({
    //            value: ErgoAddress.fromBase58(hodlerPK).getPublicKeys()[0],
    //            type: SigmaTypeCode.GroupElement
    //        })
    //    }
    //}
    )
    //return tree.toAddress(Network.Mainnet).toP2SH()
    return tree.toAddress(Network.Mainnet).toString()
}

console.log(comp())
//console.log(compile(`sigmaProp(true)`).toAddress(Network.Testnet).toString())