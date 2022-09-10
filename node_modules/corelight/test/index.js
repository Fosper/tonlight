import { createReadStream, createWriteStream, writeFileSync } from 'fs'
import corelight from '../'

const folderName = `test`
const self = `${folderName}->test.js`;

(async (...opt) => {
    let func = corelight.func.init(self, opt, { dumpLevel: 2, initiator: `Run` })
    let run

    // console.log(`Function 'getType':`)
    // var options = `test string`
    // run = corelight.getType(func, options)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getTs':`)
    // run = await corelight.getTs()
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getDefaultOptions':`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {},
    //     test1_12: `not in default`
    // }
    // var defaultOptions = {
    //     test1_1: 1,
    //     test1_2: false,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test_test`, test2_2: `test_test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: `test`,
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // run = await corelight.getDefaultOptions(func, options, defaultOptions, { defaultMatch: false, defaultPrimary: false, defaultPure: false })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableTypes':`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {},
    //     test1_12: `not in default`
    // }
    // var availableTypes = {
    //     test1_1: [ `Undefined` ],
    //     test1_2: [ `Boolean` ],
    //     test1_3: [ `Number` ],
    //     test1_4: [ `String` ],
    //     test1_5: [ `Symbol` ],
    //     test1_6: [ `Null` ],
    //     test1_7: { test2_1: [ `String`] },
    //     test1_8: [ `Array` ],
    //     test1_9: [ `Readable` ],
    //     test1_10: [ `Writable` ],
    //     test1_11: [ `Function` ],
    // }
    // run = await corelight.isAvailableTypes(func, options, availableTypes, { typesMatch: true })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableValues':`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     // test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {},
    //     test1_12: 8,
    //     test1_13: `-10000000000000000000000000000`
    // }
    // var availableValues = {
    //     test1_1: {},
    //     test1_2: {
    //         values: [ true ]
    //     },
    //     test1_3: {
    //         min: 1,
    //         max: 1,
    //         minLength: 1,
    //         maxLength: 1,
    //         values: [ 1 ]
    //     },
    //     test1_4: {
    //         minLength: 13,
    //         maxLength: 13,
    //         values: [ `/etc/hostname` ],
    //         existPath: true
    //     },
    //     test1_5: {},
    //     test1_6: {
    //         values: [ null ]
    //     },
    //     test1_7: {
    //         test2_1: {
    //             minLength: 4,
    //             maxLength: 4,
    //             values: [ `test` ]
    //         }
    //     },
    //     test1_8: {
    //         minLength: 2,
    //         maxLength: 2
    //     },
    //     test1_12: {
    //         mustBePositiveNum: true
    //     },
    //     test1_13: {
    //         mustBeNegativeNum: true
    //     }
    // }
    // run = await corelight.isAvailableValues(func, options, availableValues, { valuesMatch: false })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'try' (without errors):`)
    // var options = () => { return `Hello world` }
    // run = await corelight.try(func, options)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'try' (with errors):`)
    // var options = () => { return `Hello world` }
    // run = await corelight.try(func, options)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isNum':`)
    // run = await corelight.isNum(func, `-112233445566778899`, { mustBePositive: false, mustBeNegative: true })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getRandInt':`)
    // run = await corelight.getRandInt(func)
    // console.log(run)
    // console.log(`\n`)
})()