import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import corelight from 'corelight'

export default class {
    static self = `ton`
    constructor(...opt) { this.opt = opt[0] }

    /**
     * @param {string} @arg object.configFilePath - Required.
     * @param {string} @arg object.tmpDirPath - Required.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: false.
     * @param {string} @arg object.lightClientFilePath - Default '/usr/bin/ton/lite-client/lite-client'.
     * @param {string} @arg object.fiftFilePath - Default '/usr/bin/ton/crypto/fift'.
     * @param {string} @arg object.fiftLibDirPath - Default '/usr/src/ton/crypto/fift/lib'.
     * @param {string} @arg object.funcFilePath - Default '/usr/bin/ton/crypto/func'.
     * @param {string} @arg object.stdlibFilePath - Default '/usr/src/ton/crypto/smartcont/stdlib.fc'.
     * 
     * @returns {promise} this
     */
    static init = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.self}->init`, opt)
                .args()

            func.default = {
                configFilePath: undefined,
                tmpDirPath: undefined,
                secureWords: [],
                keepFiles: false,
                lightClientFilePath: `/usr/bin/ton/lite-client/lite-client`,
                fiftFilePath: `/usr/bin/ton/crypto/fift`,
                fiftLibDirPath: `/usr/src/ton/crypto/fift/lib`,
                funcFilePath: `/usr/bin/ton/crypto/func`,
                stdlibFilePath: `/usr/src/ton/crypto/smartcont/stdlib.fc`,
            }

            func.types = {
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                configFilePath: { existPath: true },
                tmpDirPath: { existPath: true },
                lightClientFilePath: { existPath: true },
                fiftFilePath: { existPath: true },
                fiftLibDirPath: { existPath: true },
                funcFilePath: { existPath: true },
                stdlibFilePath: { existPath: true },
            }

            await func.validate({ defaultPure: true })
            if (func.result.error) { resolve(func.err()); return }

            resolve(func.succ(new this(func.opt)))
            return
        })
    }

    /**
     * @arg {string} @arg code - Required.
     * 
     * @returns {promise}
     */
    isCodeFunc = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->isCodeFunc`, opt)
                .args(`code`)

            func.types = {
                code: [ `String` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            if (func.opt.code.includes(`() recv_internal`)) { resolve(func.succ(true)); return }
            resolve(func.succ(false))
            return
        })
    }

    /**
     * @arg {string} @arg code - Required.
     * 
     * @returns {promise}
     */
    isCodeFift = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->isCodeFift`, opt)
                .args(`code`)

            func.types = {
                code: [ `String` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            if (func.opt.code.includes(`<{`)) { resolve(func.succ(true)); return }
            resolve(func.succ(false))
            return
        })
    }

    /**
     * @arg {string} @arg code - Required.
     * 
     * @returns {promise}
     */
    isCodeBoc = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->isCodeBoc`, opt)
                .args(`code`)

            func.types = {
                code: [ `String` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            if (func.opt.code.includes(`x{`)) { resolve(func.succ(true)); return }
            resolve(func.succ(false))
            return
        })
    }

    /**
     * @param {string} @arg object.code - Required. Fift code.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    execFift = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->execFift`, opt)
                .args()

            func.default = {
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                code: [ `String` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ],
            }

            func.values = {
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run

            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { value: null, files: [] }

            let fiftFilePath
            run = await corelight.getRandStr(func)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            fiftFilePath = `${func.opt.tmpDirPath}/${run.data}.fif`
            result.files.push(fiftFilePath)

            run = await corelight.try(func, writeFileSync, [ fiftFilePath , func.opt.code, `utf-8` ], func.opt.secureWords)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }

            run = await corelight.execCmd(func, `${this.opt.fiftFilePath} -I ${this.opt.fiftLibDirPath} ${fiftFilePath}`, func.opt.secureWords)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            if (run.data.includes(`Error`)) { resolve(func.err(run.data, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.value = run.data

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }

            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.code - Required. Func code.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    funcToFift = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->funcToFift`, opt)
                .args()

            func.default = {
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                code: [ `String` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run

            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { value: null, files: [] }

            let fiftFilePath, funcFilePath
            for (let i = 0; i < 2; i++) {
                run = await corelight.getRandStr(func)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                if (i === 0) { fiftFilePath = `${func.opt.tmpDirPath}/${run.data}.fif`; continue }
                if (i === 1) funcFilePath = `${func.opt.tmpDirPath}/${run.data}.fc`
            }
            result.files.push(fiftFilePath)
            result.files.push(funcFilePath)

            run = await corelight.try(func, writeFileSync, [ funcFilePath , func.opt.code, `utf-8` ], func.opt.secureWords)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }

            run = await corelight.execCmd(func, `${this.opt.funcFilePath} -SPA ${this.opt.stdlibFilePath} ${funcFilePath} -o ${fiftFilePath}`, func.opt.secureWords)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            if (run.data.includes(`Error`)) { resolve(func.err(run.data, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }

            run = await corelight.try(func, readFileSync, [ fiftFilePath, `utf-8` ], func.opt.secureWords)

            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.value = run.data
            
            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }
            
            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    getKeypair = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->getKeypair`, opt)
                .args()

            func.default = {
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run

            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { privateKey: null, publicKey: null, files: [] }

            let pkFilePath
            run = await corelight.getRandStr(func)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            pkFilePath = `${func.opt.tmpDirPath}/${run.data}.pk`
            result.files.push(pkFilePath)

            let codeFift = `#!/usr/bin/fift -s
            "TonUtil.fif" include
            "Asm.fif" include

            "${pkFilePath}" load-generate-keypair
            0 pick .dump cr
            1 pick .dump cr`

            run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]

            run.data.value = run.data.value.split(`BYTES:`)
            if (corelight.getType(run.data.value[1]) === `Undefined` || corelight.getType(run.data.value[1]) === `Undefined`) {
                resolve(func.err(`Error when trying to generate keypair.`, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }
            result.privateKey = run.data.value[1].replaceAll(`\n`, ``).replaceAll(` `, ``)
            result.publicKey = run.data.value[2].replaceAll(`\n`, ``).replaceAll(` `, ``)

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }
            
            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.message - Required.
     * @param {string} @arg object.privateKey  - Required.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    getMessageSignature = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->getMessageSignature`, opt)
                .args()

            func.default = {
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                message: [ `String` ],
                privateKey: [ `String` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run
            
            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { value: null, files: [] }

            let codeFift = `#!/usr/bin/fift -s
            "TonUtil.fif" include
            "Asm.fif" include
            
            B{${func.opt.privateKey}}
            
            ${func.opt.message} constant message
            message hashu 1 pick ed25519_sign_uint
            .dump cr`

            run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]

            run.data.value = run.data.value.split(`BYTES:`)
            if (corelight.getType(run.data.value[1]) === `Undefined`) {
                resolve(func.err(`Error when trying to get message signature.`, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }
            result.value = run.data.value[1].replaceAll(`\n`, ``).replaceAll(` `, ``)

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }
            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.address - Default: 'EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w'. Format can be: path to addr file, 'EQB36_EfYjF..', '0,53423842..'.
     * @param {string} @arg object.output  - Default 'bounceable'. Can be 'bounceable', 'non-bounceable', 'raw'.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    parseAddress = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->parseAddress`, opt)
                .args()

            func.default = {
                address: `EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w`,
                output: `bounceable`,
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                address: [ `String` ],
                output: [ `String` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                output: { values: [ `bounceable`, `non-bounceable`, `raw` ] },
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run

            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { wc: null, address: null, wcBits: 8, files: [] }

            let isAddressInFile, isAddressBase64, isAddressRaw = false
            if (func.opt.address.substr(0, 1) === `/`) {
                if (!corelight.isExistsPath(func.opt.address).data) { resolve(func.err(`Address file must be exists.`, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                isAddressInFile = true
            } else if (func.opt.address.includes(`,`)) {
                isAddressRaw = true
            } else {
                isAddressBase64 = true
            }
            
            let codeFift
            if (!isAddressRaw) {
                if (isAddressInFile) {
                    codeFift = `#!/usr/bin/fift -s
                    "TonUtil.fif" include
                    "Asm.fif" include
        
                    "${func.opt.address}" file>B 32 B| 8 B>i@ swap 256 B>u@ .s`
                } else {
                    codeFift = `#!/usr/bin/fift -s
                    "TonUtil.fif" include
                    "Asm.fif" include
        
                    "${func.opt.address}"
                    $>smca 0= abort"bad creator address" drop .s`
                }

                run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = [ ...result.files, ...run.data.files ]
                func.opt.address = run.data.value.replaceAll(`\n`, ``).replaceAll(` `, `,`)
            }

            result.wc = func.opt.address.split(`,`)[0]
            let addr = func.opt.address.split(`,`)[1]

            let options = { wc: parseInt(result.wc), addr }
            let availableValues = {
                wc: { min: -1, max: 4294967295 },
                addr: {
                    min: `0`,
                    max: `13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084095`
                }
            }
            run = await corelight.isAvailableValues(func, options, availableValues)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }

            if (parseInt(result.wc) < -127 || parseInt(result.wc) > 127) result.wcBits = 32

            if (func.opt.output === `raw`) {
                result.address = addr
            } else {
                codeFift = `#!/usr/bin/fift -s
                "TonUtil.fif" include
                "Asm.fif" include
    
                ${result.wc} ${addr} ${func.opt.output === `bounceable` ? `4` : `5`} smca>$ .s`

                run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = [ ...result.files, ...run.data.files ]
                result.address = run.data.value.replaceAll(`\n`, ``).replaceAll(` `, ``).replaceAll(`"`, ``)
            }

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }
            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.cell - Default: '<b b>'.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * @returns {promise}
     */
    getCellBits = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->getCellBits`, opt)
                .args()

            func.default = {
                cell: `<b b>`,
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles
            }

            func.types = {
                cell: [ `String` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ]
            }

            func.values = {
                tmpDirPath: { existPath: true }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run
            
            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { value: null, files: [] }

            let codeFift = `#!/usr/bin/fift -s
            "TonUtil.fif" include
            "Asm.fif" include

            ${func.opt.cell} <s sbits .s`

            run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]
            result.value = run.data.value.replaceAll(`\n`, ``).replaceAll(` `, ``)

            run = await corelight.isNum(func, result.value, { mustBePositive: true })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }

            resolve(func.succ(result))
            return
        })
    }

    /**
     * @param {string} @arg object.type - Default: 'external'. Can be 'external' or 'internal'.
     * @param {string} @arg object.scheme - Default: 'CommonMsgInfoRelaxed'. Can be 'CommonMsgInfo' or 'CommonMsgInfoRelaxed'.
     * @param {string} @arg object.scNc - Default: '1000000000'. Must be from 0 to 10 000 000 000 000 000 000.
     * @param {boolean} @arg object.scAddressAnycast - Default: false.
     * @param {string} @arg object.scAddress - Default: 'EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w'.
     * @param {string} @arg object.scCode - Required. Smart contract Fift or Func code.
     * @param {string} @arg object.scStorage - Default: '<b b>'. Smart contract storage.
     * @param {string} @arg object.msgBody - Default: '<b b>'. Smart contract message body.
     * @param {number} @arg object.sysGasLimit - Default: 1000000. Must be from 0 to 20 000 000.
     * @param {number} @arg object.sysDateTs - Default: current timestamp. Must be from 0 to 4 294 967 295.
     * @param {string} @arg object.tmpDirPath - Default: this.opt.tmpDirPath.
     * @param {array} @arg object.secureWords - Default: []. Replace all match words in output to ''.
     * @param {boolean} @arg object.keepFiles - Default: this.opt.keepFiles.
     * 
     * If object.type = 'external':
     * @param {string} @arg object.msgImportFee - Default: '0'. Must be from 0 to 10 000 000 000.
     * 
     * If object.type = 'internal':
     * @param {boolean} @arg object.msgIhrDisabled - Default: true.
     * @param {boolean} @arg object.msgBounce - Default: true.
     * @param {boolean} @arg object.msgBounced - Default: false.
     * @param {boolean} @arg object.msgAddressAnycast - Default: false.
     * @param {string} @arg object.msgAddress - Default: 'EQCJ0sh9po5xnCF2bZq6KyY1PO1FyeIWT+NnFaME9H+nFW1H'.
     * @param {string} @arg object.msgNc - Default: '1000000000'. Must be from 0 to 10 000 000 000 000 000 000.
     * @param {string} @arg object.msgIhrFee - Default: '0'. Must be from 0 to 10 000 000 000.
     * @param {string} @arg object.msgFwdFee - Default: '0'. Must be from 0 to 10 000 000 000.
     * @param {string} @arg object.msgCreatedLt - Default: '0'. From 0 to 18 446 744 073 709 551 615.
     * @param {number} @arg object.msgCreatedAt - Default: current timestamp - 5.
     * @param {number} @arg object.msgOp - Default: -1. Must be from 0 to 4 294 967 295 if need to set op.
     * @param {string} @arg object.msgPayload - Default: ''.
     * 
     * @returns {promise}
     */
    emulate = (...opt) => {
        return new Promise(async (resolve) => {
            let func = corelight.func.init(`${this.constructor.self}->emulate`, opt)
                .args()
            
            let currentTs = corelight.getTs(true).data
            func.default = {
                type: `external`,
                scheme: `CommonMsgInfoRelaxed`,
                msgBody: `<b b>`,
                scAddressAnycast: false,
                scAddress: `EQB36_EfYjFYMV8p_cxSYX61bA0FZ4B65ZNN6L8INY-5gL6w`,
                scNc: `1000000000`,
                scStorage: `<b b>`,
                sysGasLimit: 1000000,
                sysDateTs: currentTs,
                tmpDirPath: this.opt.tmpDirPath,
                secureWords: [],
                keepFiles: this.opt.keepFiles,
                msgImportFee: `0`,
                msgAddressAnycast: false,
                msgAddress: `EQCJ0sh9po5xnCF2bZq6KyY1PO1FyeIWT+NnFaME9H+nFW1H`,
                msgNc: `1000000000`,
                msgIhrDisabled: true,
                msgBounce: true,
                msgBounced: false,
                msgCreatedLt: `0`,
                msgCreatedAt: currentTs - 5,
                msgOp: -1,
                msgPayload: ``,
                msgIhrFee: `0`,
                msgFwdFee: `0`
            }

            func.types = {
                type: [ `String` ],
                scheme: [ `String` ],
                msgBody: [ `String` ],
                scAddressAnycast: [ `Boolean` ],
                scAddress: [ `String` ],
                scNc: [ `String` ],
                scStorage: [ `String` ],
                scCode: [ `String` ],
                sysGasLimit: [ `Number` ],
                sysDateTs: [ `Number` ],
                tmpDirPath: [ `String` ],
                secureWords: [ `Array` ],
                keepFiles: [ `Boolean` ],
                msgImportFee: [ `String` ],
                msgAddressAnycast: [ `Boolean` ],
                msgAddress: [ `String` ],
                msgNc: [ `String` ],
                msgIhrDisabled: [ `Boolean` ],
                msgBounce: [ `Boolean` ],
                msgBounced: [ `Boolean` ],
                msgCreatedLt: [ `String` ],
                msgCreatedAt: [ `Number` ],
                msgOp: [ `Number`, `Null` ],
                msgPayload: [ `String` ],
                msgIhrFee: [ `String` ],
                msgFwdFee: [ `String` ]
            }

            func.values = {
                type: { values: [ `external`, `internal` ] },
                scheme: { values: [ `CommonMsgInfoRelaxed`, `CommonMsgInfo` ] },
                scNc: { min: `0`, max: `10000000000000000000` },
                scCode: { minLength: 1 },
                sysGasLimit: { min: 0, max: 20000000 },
                sysDateTs: { min: 0, max: 4294967295 },
                tmpDirPath: { existPath: true },
                msgImportFee: { min: `0`, max: `10000000000` },
                msgNc: { min: `0`, max: `10000000000000000000` },
                msgCreatedLt: { min: `0`, max: `18446744073709551615` },
                msgCreatedAt: { min: 0, max: 4294967295 },
                msgOp: { min: -1, max: 4294967295 },
                msgIhrFee: { min: `0`, max: `10000000000` },
                msgFwdFee: { min: `0`, max: `10000000000` }
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }

            func.opt.secureWords = func.opt.secureWords.concat(this.opt.secureWords)
            let run

            run = await corelight.getRandStr(func)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            func.opt.tmpDirPath = `${func.opt.tmpDirPath}/${func.iter}.${func.name.split(`>`)[1]}-${run.data}`
            run = await corelight.try(func, mkdirSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
            if (func.result.err) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            let result = { value: null, files: [] }
            
            if (func.opt.scheme !== `CommonMsgInfoRelaxed`) {
                resolve(func.err(`Message type must be 'CommonMsgInfoRelaxed', because other types not realized yet.`, `1`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }

            let isScCodeFift, isScCodeFunc  = false
            run = await this.isCodeFunc(func, func.opt.scCode)
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            isScCodeFunc = run.data

            if (!isScCodeFunc) {
                run = await this.isCodeFift(func, func.opt.scCode)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                isScCodeFift = run.data
            }

            if (!isScCodeFunc && !isScCodeFift) {
                resolve(func.err(`Code must be FunC or Fift format.`, `2`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }

            if (isScCodeFunc) {
                run = await this.funcToFift(func, { code: func.opt.scCode, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = [ ...result.files, ...run.data.files ]
                func.opt.scCode = run.data.value
            }

            if (corelight.getType(func.opt.scCode) !== `String`) {
                resolve(func.err(`Incorrect smart contract code.`, `3`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }

            let privateKey, publicKey 
            run = await this.getKeypair(func, { tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]
            privateKey = run.data.privateKey
            publicKey = run.data.publicKey

            func.opt.scStorage = func.opt.scStorage.replaceAll(`!privateKey`, `B{${privateKey}}`)
            func.opt.scStorage = func.opt.scStorage.replaceAll(`!publicKey`, `B{${publicKey}}`)
            func.opt.msgBody = func.opt.msgBody.replaceAll(`!privateKey`, `B{${privateKey}}`)
            func.opt.msgBody = func.opt.msgBody.replaceAll(`!publicKey`, `B{${publicKey}}`)

            run = await this.getMessageSignature(func, { message: func.opt.msgBody.replaceAll(`!privateKey B,`, ``).replaceAll(`!publicKey B,`, ``).replaceAll(`!signature B,`, ``), privateKey, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]
            func.opt.scStorage = func.opt.scStorage.replaceAll(`!signature`, `B{${run.data.value}}`)
            func.opt.msgBody = func.opt.msgBody.replaceAll(`!signature`, `B{${run.data.value}}`)

            let scWc, scAddr
            run = await this.parseAddress(func, { address: func.opt.scAddress, output: `raw`, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]
            scWc = run.data.wc
            scAddr = run.data.address

            let msgBodyBits
            if (func.opt.type === `internal`) {
                let msgBodyEnd = ``
                if (func.opt.msgOp !== -1 || func.opt.msgPayload.length) {
                    if (func.opt.msgOp === -1 && func.opt.msgPayload.length) func.opt.msgOp = 0
                    msgBodyEnd = ` ${func.opt.msgOp} 32 u, `
                    if (func.opt.msgPayload.length) msgBodyEnd += `124 word ${func.opt.msgPayload}| $, `
                    run = func.opt.msgBody.split(`b>`)
                    if (run.length >= 2) run[run.length - 2] += msgBodyEnd
                    func.opt.msgBody = run.join(`b>`)
                }
            }

            run = await this.getCellBits(func, { cell: func.opt.msgBody, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(`Message body more than 1023 bits.`, `4`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]
            msgBodyBits = parseInt(run.data.value)

            let msgBodyInRef = false
            let msgFullBits, msgFull, codeFift
            switch (func.opt.scheme) {
                case `CommonMsgInfoRelaxed`:
                    if (func.opt.type === `external`) {
                        msgFullBits = 279
                        run = await this.getCellBits(func, { cell: `<b ${func.opt.msgImportFee} Gram, b>`, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                        if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                        result.files = [ ...result.files, ...run.data.files ]
                        msgFullBits += parseInt(run.data.value)
                        if (msgBodyBits > (1023 - msgFullBits)) msgBodyInRef = true

                        msgFull = `<b
                        // message$_ {X:Type}
                            // info:CommonMsgInfoRelaxed
                                b{10} s,                            // ext_in_msg_info$10

                                // src:MsgAddressExt
                                b{00} s,                            // addr_none$00

                                // dest:MsgAddressInt
                                b{10} s,                            // addr_std$10
                                b{${+func.opt.scAddressAnycast}} s, // anycast:(Maybe Anycast)
                                ${scWc} 8 i,                        // workchain_id:int8
                                ${scAddr} 256 u,                    // address:bits256

                                ${func.opt.msgImportFee} Gram,      // import_fee:Grams
        
                            // init:(Maybe (Either StateInit ^StateInit))
                                // Maybe
                                b{1} s,                              // Is have StateInit: true
                                b{0} s,                              // Is StateInit in ref
        
                                // StateInit
                                b{0} s,                              // split_depth: false
                                b{0} s,                              // special: false
                                b{1} s,                              // code in ref: true
                                b{1} s,                              // data (storage) in ref: true
                                ${func.opt.scCode} ref,              // ref to code
                                ${func.opt.scStorage} ref,           // ref to data (storage)
                                null dict,                           // library: hme_empty (1 bit)
        
                            // body:(Either X ^X) = MessageRelaxed X;
                                b{${msgBodyInRef ? `1` : `0`}} s,                     // Is message body in ref
                                ${func.opt.msgBody} ${msgBodyInRef ? `ref` : `<s s`}, // Message body
                        b>`
                    } else {
                        msgFullBits = 637
                        run = await this.getCellBits(func, { cell: `<b ${func.opt.msgNc} Gram, ${func.opt.msgIhrFee} Gram, ${func.opt.msgFwdFee} Gram, b>`, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                        if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                        result.files = [ ...result.files, ...run.data.files ]
                        msgFullBits += parseInt(run.data.value)
                        if (msgBodyBits > (1023 - msgFullBits)) msgBodyInRef = true

                        let msgWc, msgAddr
                        run = await this.parseAddress(func, { address: func.opt.msgAddress, output: `raw`, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
                        if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                        result.files = [ ...result.files, ...run.data.files ]
                        msgWc = run.data.wc
                        msgAddr = run.data.address

                        msgFull = `<b
                        // message$_ {X:Type}
                            // info:CommonMsgInfoRelaxed
                                b{0} s,                              // int_msg_info$0
                                b{${+func.opt.msgIhrDisabled}} s,    // ihr_disabled:Bool
                                b{${+func.opt.msgBounce}} s,         // bounce:Bool
                                b{${+func.opt.msgBounced}} s,        // bounced:Bool

                                // src:MsgAddress
                                b{10} s,                             // addr_std$10
                                b{${+func.opt.msgAddressAnycast}} s, // anycast:(Maybe Anycast)
                                ${msgWc} 8 i,                        // workchain_id:int8
                                ${msgAddr} 256 u,                    // address:bits256

                                // dest:MsgAddressInt
                                b{10} s,                             // addr_std$10
                                b{${+func.opt.scAddressAnycast}} s,  // anycast:(Maybe Anycast)
                                ${scWc} 8 i,                         // workchain_id:int8
                                ${scAddr} 256 u,                     // address:bits256

                                // value:CurrencyCollection
                                ${func.opt.msgNc} Gram,              // grams:Grams
                                null dict,                           // other:ExtraCurrencyCollection

                                ${func.opt.msgIhrFee} Gram,          // ihr_fee:Grams
                                ${func.opt.msgFwdFee} Gram,          // fwd_fee:Grams
                                ${func.opt.msgCreatedLt} 64 u,       // created_lt:uint64
                                ${func.opt.msgCreatedAt} 32 u,       // created_at:uint32
                            
                            // init:(Maybe (Either StateInit ^StateInit))
                                // Maybe
                                b{0} s,                              // Is have StateInit: false
                            
                            // body:(Either X ^X) = MessageRelaxed X;
                                b{${msgBodyInRef ? `1` : `0`}} s,                     // Message body in ref
                                ${func.opt.msgBody} ${msgBodyInRef ? `ref` : `<s s`}, // Message body
                        b>`
                    }

                    codeFift = `
                    "TonUtil.fif" include
                    "Asm.fif" include
                    
                    0x076ef1ea                             // magic
                    0                                      // actions
                    0                                      // msgs_sent
                    ${func.opt.sysDateTs}                  // unixtime
                    1                                      // block_lt
                    1                                      // trans_lt
                    239                                    // randseed
                    ${func.opt.scNc} null pair             // balance_remaining
                    <b ${scWc} 8 i, ${scAddr} 256 u, b> <s // myself address
                    null                                   // global_config
                    10 tuple 1 tuple constant c7           // save as c7 cell
        
                    ${func.opt.scNc}
                    ${func.opt.msgNc}
                    ${msgFull}
                    ${func.opt.msgBody} <s
                    ${func.opt.type === `internal` ? `0` : `-1`}
                    ${func.opt.scCode.replaceAll(`}END>c`, `}END>s`)}
                    ${func.opt.scStorage}
                    c7
                    ${func.opt.sysGasLimit}
                    0x7d runvmx`
                    break
                case `CommonMsgInfo`:
                    codeFift = ``
                    // TODO
                    break
            }

            run = await this.execFift(func, { code: codeFift, tmpDirPath: func.opt.tmpDirPath, secureWords: func.opt.secureWords, keepFiles: func.opt.keepFiles })
            if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
            result.files = [ ...result.files, ...run.data.files ]

            if (run.data.value.includes(`Command failed:`)) {
                resolve(func.err(`Error while trying to get result.`, `5`, 2, [ func.opt.tmpDirPath ], !func.opt.keepFiles))
                return
            }

            result.value = run.data.value

            if (!func.opt.keepFiles) {
                run = await corelight.try(func, rmSync, [ func.opt.tmpDirPath, { recursive: true } ], func.opt.secureWords)
                if (run.error) { resolve(func.err(run, [ func.opt.tmpDirPath ], !func.opt.keepFiles)); return }
                result.files = []
            }

            resolve(func.succ(result))
            return
        })
    }
}