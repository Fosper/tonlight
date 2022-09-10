import fs from 'fs'
import path from 'path'
import corelight from 'corelight'
import tonlight from '../'

const folderName = `test`
const self = `${folderName}->test.js`;

(async (...opt) => {
    let func = corelight.func.init(self, { initiator: `Run`, dumpLevel: 2 })
    let run

    run = await tonlight.init(func, {
        configFilePath: path.resolve(`./config/testnet-global.config.json`),
        tmpDirPath: path.resolve(`./test/tmp`)
    })
    if (run.error) { console.log(run.error); return }

    const Tonlight = run.data

    // console.log(`Function 'isCodeFunc':`)
    // run = await Tonlight.isCodeFunc(func, `() recv_internal`)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isCodeFift':`)
    // run = await Tonlight.isCodeFift(func, `<{`)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isCodeBoc':`)
    // run = await Tonlight.isCodeBoc(func, `x{`)
    // console.log(run)
    // console.log(`\n`)
    
    // console.log(`Function 'execFift':`)
    // run = await Tonlight.execFift(func, { code: `#!/usr/bin/fift -s \n bl word Hello .s` })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'funcToFift':`)
    // run = await Tonlight.funcToFift(func, { code: fs.readFileSync(path.resolve(`./test/sc.fc`), `utf-8`) })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getKeypair':`)
    // run = await Tonlight.getKeypair(func)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getMessageSignature':`)
    // run = await Tonlight.getMessageSignature(func, { message: `<b b>`, privateKey: `E5A841ECA1872631699451177EEC49AAC9F5993DD6CA8AEF760CCCFD4026169E` })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'parseAddress':`)
    // run = await Tonlight.parseAddress(func, { address: path.resolve(`./test/test.addr`), output: `bounceable` })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getCellBits':`)
    // run = await Tonlight.getCellBits(func, { cell: `<b 0 8 u, b>` })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'emulate' (external):`)
    // run = await Tonlight.emulate(func, {
    //     type: `external`,
    //     msgType: `CommonMsgInfoRelaxed`,
    //     msgBody: `<b b>`,
    //     scAddressAnycast: false,
    //     scAddress: `EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w`,
    //     scNc: `1000000000`,
    //     scStorage: `<b b>`,
    //     scCode: fs.readFileSync(path.resolve(`./test/sc.fc`), `utf-8`),
    //     sysGasLimit: 1000000,
    //     sysDateTs: corelight.getTs(true),
    //     tmpDirPath: path.resolve(`./test/tmp`),
    //     secureWords: [ `/var` ],
    //     keepFiles: false,
    //     sysImportFee: `0`
    // })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'emulate' (internal):`)
    // run = await Tonlight.emulate(func, {
    //     type: `internal`,
    //     msgType: `CommonMsgInfoRelaxed`,
    //     msgBody: `<b b>`,
    //     scAddressAnycast: false,
    //     scAddress: `EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w`,
    //     scNc: `1000000000`,
    //     scStorage: `<b b>`,
    //     scCode: fs.readFileSync(path.resolve(`./test/sc.fc`), `utf-8`),
    //     sysGasLimit: 1000000,
    //     sysDateTs: corelight.getTs(true),
    //     tmpDirPath: path.resolve(`./test/tmp`),
    //     secureWords: [ `/var` ],
    //     keepFiles: false,

    //     msgAddressAnycast: false,
    //     msgAddress: `EQCJ0sh9po5xnCF2bZq6KyY1PO1FyeIWT+NnFaME9H+nFW1H`,
    //     msgNc: `1000000000`,
    //     msgIhrDisabled: true,
    //     msgBounce: true,
    //     msgBounced: false,
    //     msgCreatedLt: `0`,
    //     msgCreatedAt: corelight.getTs(true) - 5,
    //     msgOp: -1,
    //     msgPayload: ``,
    //     sysIhrFee: `0`,
    //     sysFwdFee: `0`
    // })
    // console.log(run)
    // console.log(`\n`)
})()