import { existsSync } from 'fs'
import { exec } from 'child_process'
import { Readable, Writable } from 'stream'
import func from './lib/func'

export default class {
    static self = `corelight`
    static func = func

    /**
     * @arg {any} @param value  - Default: undefined.
     * 
     * @returns {string}
     */
    static getType = (...opt) => {
        let value = undefined
        if (opt.length) value = opt[0]
        return Object.prototype.toString.call(value).replace(`[object `, ``).replace(`]`, ``)
    }
    
    /**
     * @arg {boolean} @param isShort  - Default: false. If false - timestamp length is 13, if true - 10.
     * 
     * @returns {number}
     */
    static getTs = (...opt) => {
        let isShort = false
        if (opt.length && this.getType(opt[0]) === `Boolean`) isShort = opt[0]
        return isShort ? parseInt(Date.now().toString().substr(0, 10)) : Date.now()
    }

    /**
     * @arg {string} @param path  - Default: false. If false - timestamp length is 13, if true - 10.
     * 
     * @returns {boolean}
     */
    static isExistsPath = (...opt) => {
        if (!opt.length || this.getType(opt[0]) !== `String`) return false
        return existsSync(opt[0])
    }

    /**
     * @arg {object} @param object_1.options - Default: {}
     * @arg {object} @param object_1.defaultOptions - Default: {}
     * @arg {boolean} @param object_2.defaultMatch - Default: false
     * @arg {boolean} @param object_2.defaultPrimary - Default: false
     * @arg {boolean} @param object_2.defaultPure - Default: false
     * 
     * @returns {promise}
     */
    static getDefaultOptions = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getDefaultOptions`, opt)
                .args(`options`)
                .args(`defaultOptions`)
                .args()

            if (this.getType(func.opt.options) !== `Object`) func.opt.options = {}
            if (this.getType(func.opt.defaultOptions) !== `Object`) func.opt.defaultOptions = {}
            if (this.getType(func.opt.defaultMatch) !== `Boolean`) func.opt.defaultMatch = false
            if (this.getType(func.opt.defaultPrimary) !== `Boolean`) func.opt.defaultPrimary = false
            if (this.getType(func.opt.defaultPure) !== `Boolean`) func.opt.defaultPure = false
            
            let run
            let newOptions = {}
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(optionValue)
                let defaultOptionValue = func.opt.defaultOptions[optionName]
                let defaultOptionExist = Object.keys(func.opt.defaultOptions).includes(optionName)

                if (func.opt.defaultMatch && !defaultOptionExist) {
                    resolve(func.err(`'options.${optionName}' not defined in 'default', but must be. Because option 'defaultMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.getDefaultOptions(func, optionValue, defaultOptionValue, { defaultMatch: func.opt.defaultMatch, defaultPrimary: func.opt.defaultPrimary, defaultPure: func.opt.defaultPure })
                    if (run.error) {
                        resolve(func.err(run))
                        return
                    }
                    newOptions[optionName] = run.data
                    continue
                }

                if (func.opt.defaultPrimary && defaultOptionExist) {
                    newOptions[optionName] = defaultOptionValue
                    continue
                }

                if (func.opt.defaultPure && !defaultOptionExist) {
                    continue
                }

                if (optionValueType === `Undefined` && defaultOptionExist) {
                    newOptions[optionName] = defaultOptionValue
                } else {
                    newOptions[optionName] = optionValue
                }
            }
            resolve(func.succ(newOptions))
            return
        })
    }

    /**
     * @arg {object} @param object_1.options - Default: {}
     * @arg {object} @param object_1.availableTypes - Default: {}
     * @arg {boolean} @param object_2.typesMatch - Default: false
     * 
     * @returns {promise}
     */
    static isAvailableTypes = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableTypes`, opt)
                .args(`options`)
                .args(`availableTypes`)
                .args()

            if (this.getType(func.opt.options) !== `Object`) func.opt.options = {}
            if (this.getType(func.opt.availableTypes) !== `Object`) func.opt.availableTypes = {}
            if (this.getType(func.opt.typesMatch) !== `Boolean`) func.opt.typesMatch = false
    
            let run
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func.opt.options[optionName])
                let availableTypesValue = func.opt.availableTypes[optionName]
                let availableTypesValueType = this.getType(availableTypesValue)
                let availableTypesExist = Object.keys(func.opt.availableTypes).includes(optionName)
    
                if (func.opt.typesMatch && !availableTypesExist) {
                    resolve(func.err(`'options.${optionName}' must be defined in types options, because option 'typesMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableTypes(func, optionValue, availableTypesValue, { typesMatch: func.opt.typesMatch })
                    if (run.error) {
                        resolve(func.err(run))
                        return
                    }
                    if (!run.data) {
                        resolve(func.succ(run))
                        return
                    }
                    continue
                }

                if (availableTypesValueType !== `Array` && availableTypesValueType !== `Undefined`) {
                    resolve(func.err(`'options.${optionName}' must be type of 'Array' or 'Undefined'. ${availableTypesValueType} given.`, `2`, 1))
                    return
                }

                if (availableTypesValueType === `Undefined`) {
                    availableTypesValue = []
                }
                if (!availableTypesValue.length) {
                    continue
                }
                if (availableTypesValue.includes(optionValueType)) {
                    continue
                }
                if (optionValue instanceof Readable && availableTypesValue.includes(`Readable`)) {
                    continue
                }
                if (optionValue instanceof Writable && availableTypesValue.includes(`Writable`)) {
                    continue
                }
                resolve(func.err(`'options.${optionName}' must type of '${availableTypesValue.join(`', '`)}'. ${optionValueType} given.`, `2`, 2))
                return
            }
            resolve(func.succ(true))
            return
        })
    }

    /**
     * @arg {object} @param object_1.options - Default: {}
     * @arg {object} @param object_1.availableValues - Default: {}
     * @arg {boolean} @param object_2.valuesMatch - Default: false
     * 
     * @returns {promise}
     */
    static isAvailableValues = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableValues`, opt)
                .args(`options`)
                .args(`availableValues`)
                .args()

            if (this.getType(func.opt.options) !== `Object`) func.opt.options = {}
            if (this.getType(func.opt.availableValues) !== `Object`) func.opt.availableValues = {}
            if (this.getType(func.opt.valuesMatch) !== `Boolean`) func.opt.valuesMatch = false

            let isInt = (value, mustBePositive = false, mustBeNegative = false) => {
                if (this.getType(value) !== `Number`) return false
                // if (value < Number.EPSILON) return false
                if (value === Number.NaN) return false
                if (value === Number.POSITIVE_INFINITY) return false
                if (value === Number.NEGATIVE_INFINITY) return false
                if (value > Number.MAX_SAFE_INTEGER) return false
                if (value < Number.MIN_SAFE_INTEGER) return false
                if (value.toString().includes(`.`) && value > MAX_VALUE) return false
                if (value.toString().includes(`.`) && value < MIN_VALUE) return false
                if (mustBePositive && value < 0) return false
                if (mustBeNegative && value >= 0) return false
                return true
            }

            let isBigInt = (value, mustBePositive = false, mustBeNegative = false) => {
                if (this.getType(value) !== `String`) return false
                let availableChars = [ `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` ]
                let chars = value.split(``)
                let i = 0
                for (let char of chars) {
                    if (char === `-` && i !== 1) return false
                    if (!availableChars.includes(char)) return false
                }
                if (mustBePositive && BigInt(value) < BigInt(`0`)) return false
                if (mustBeNegative && BigInt(value) >= BigInt(`0`)) return false
                return true
            }

            let isValid = (optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes) => {
                let result = { data: true, dumpLevel: null }
                if (validOptionTypes.length) {
                    if (!validOptionTypes.includes(optionValueType)) {
                        result.data = `'options.${optionName}' must be type of '${validOptionTypes.join(`', '`)}'. Because 'availableValues.${optionName}.${valuesValueName}' is set. '${optionValueType}' given.`
                        result.dumpLevel = 2
                        return result
                    }
                }
                if (validValueTypes.length) {
                    if (!validValueTypes.includes(valuesValueValueType)) {
                        result.data = `'availableValues.${optionName}.${valuesValueName}' must be type of '${validValueTypes.join(`', '`)}'. '${valuesValueValueType}' given.`
                        result.dumpLevel = 1
                        return result
                    }
                }
                if (optionValueType === `Number`) {
                    if (!isInt(optionValue)) {
                        result.data = `'options.${optionName}' must be type of valid 'Number'. Because 'availableValues.${optionName}.${valuesValueName}' is set. Invalid 'Number' given.`
                        result.dumpLevel = 2
                        return result
                    }
                }
                if (valuesValueValueType === `Number`) {
                    if (!isInt(valuesValueValue)) {
                        result.data = `'availableValues.${optionName}.${valuesValueName}' must be type of valid 'Number'. Invalid 'Number' given.`
                        result.dumpLevel = 1
                        return result
                    }
                }
                return result
            }

            let run
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func.opt.options[optionName])
                let valuesValue = func.opt.availableValues[optionName]
                let valuesValueType = this.getType(valuesValue)
                let valuesValueExist = Object.keys(func.opt.availableValues).includes(optionName)

                if (func.opt.valuesMatch && !valuesValueExist) {
                    resolve(func.err(`'options.${optionName}' must be defined in types options, because option 'valuesMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableValues(func, optionValue, valuesValue, { valuesMatch: func.opt.valuesMatch })
                    if (run.error) {
                        resolve(func.err(run))
                        return
                    }
                    if (!run.data) {
                        resolve(func.succ(run))
                        return
                    }
                    continue
                }

                if (valuesValueType !== `Object`) {
                    valuesValue = {}
                }

                let validOptionTypes = []
                let validValueTypes = []
                for (const valuesValueName in valuesValue) {
                    let valuesValueValue = valuesValue[valuesValueName]
                    let valuesValueValueType = this.getType(valuesValueValue)

                    switch (valuesValueName) {
                        case `min`:
                        case `max`:
                            validOptionTypes = [ `Number`, `String` ]
                            validValueTypes = [ `Number`, `String` ]

                            run = isValid(optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes)
                            if (run.dumpLevel) {
                                resolve(func.err(run.data, `2`, run.dumpLevel))
                                return
                            }

                            if (optionValueType === `String` && !isBigInt(optionValue)) {
                                resolve(func.err(`'options.${optionName}' must be valid 'BigInt'. '${optionValue}' given.`, `3`, 2))
                                return
                            }
                            if (valuesValueValueType === `String` && !isBigInt(valuesValueValue)) {
                                resolve(func.err(`'availableValues.${optionName}.${valuesValueName}' must be valid 'BigInt'. '${valuesValueValue}' given.`, `4`, 1))
                                return
                            }

                            switch (valuesValueName) {
                                case `min`:
                                    if (isInt(optionValue) && isInt(valuesValueValue)) {
                                        if (optionValue < valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' (${optionValue}) less than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `5`, 2))
                                            return
                                        }
                                    } else {
                                        if (BigInt(optionValue.toString()) < BigInt(valuesValueValue.toString())) {
                                            resolve(func.err(`'options.${optionName}' (${optionValue}) less than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `6`, 2))
                                            return
                                        }
                                    }
                                    break
                                case `max`:
                                    if (isInt(optionValue) && isInt(valuesValueValue)) {
                                        if (optionValue > valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' (${optionValue}) more than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `7`, 2))
                                            return
                                        }
                                    } else {
                                        if (BigInt(optionValue.toString()) > BigInt(valuesValueValue.toString())) {
                                            resolve(func.err(`'options.${optionName}' (${optionValue}) more than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `8`, 2))
                                            return
                                        }
                                    }
                                    break
                            }
                            break
                        case `mustBePositiveNum`:
                        case `mustBeNegativeNum`:
                            validOptionTypes = [ `Number`, `String` ]
                            validValueTypes = [ `Boolean` ]

                            run = isValid(optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes)
                            if (run.dumpLevel) {
                                resolve(func.err(run.data, `9`, run.dumpLevel))
                                return
                            }

                            if (optionValueType === `String` && !isBigInt(optionValue)) {
                                resolve(func.err(`'options.${optionName}' must be valid 'BigInt'. '${optionValue}' given.`, `10`, 2))
                                return
                            }

                            switch (valuesValueName) {
                                case `mustBePositiveNum`:
                                    if (optionValueType === `String`) {
                                        if (!isBigInt(optionValue, true, false)) {
                                            resolve(func.err(`'options.${optionName}' must be positive 'BigInt'. Because 'availableValues.${optionName}.${valuesValueName}' is true. '${optionValue}' given.`, `11`, 2))
                                            return
                                        }
                                    } else if (!isInt(optionValue, true, false)) {
                                        resolve(func.err(`'options.${optionName}' must be positive 'Number'. Because 'availableValues.${optionName}.${valuesValueName}' is true. '${optionValue}' given.`, `12`, 2))
                                        return
                                    }
                                    break
                                case `mustBeNegativeNum`:
                                    if (optionValueType === `String`) {
                                        if (!isBigInt(optionValue, false, true)) {
                                            resolve(func.err(`'options.${optionName}' must be negative 'BigInt'. Because 'availableValues.${optionName}.${valuesValueName}' is true. '${optionValue}' given.`, `13`, 2))
                                            return
                                        }
                                    } else if (!isInt(optionValue, false, true)) {
                                        resolve(func.err(`'options.${optionName}' must be negative 'Number'. Because 'availableValues.${optionName}.${valuesValueName}' is true. '${optionValue}' given.`, `14`, 2))
                                        return
                                    }
                                    break
                            }
                            break
                        case `minLength`:
                        case `maxLength`:
                            validOptionTypes = [ `Number`, `String`, `Array` ]
                            validValueTypes = [ `Number` ]

                            run = isValid(optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes)
                            if (run.dumpLevel) {
                                resolve(func.err(run.data, `15`, run.dumpLevel))
                                return
                            }

                            switch (valuesValueName) {
                                case `minLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length < valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) less than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `16`, 2))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length < valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) less than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `17`, 2))
                                            return
                                        }
                                    }
                                    break
                                case `maxLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length > valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) more than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `18`, 2))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length > valuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) more than 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue}).`, `19`, 2))
                                            return
                                        }
                                    }
                                    break
                            }
                            break
                        case `values`:
                            validOptionTypes = []
                            validValueTypes = [ `Array` ]

                            run = isValid(optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes)
                            if (run.dumpLevel) {
                                resolve(func.err(run.data, `20`, run.dumpLevel))
                                return
                            }
                            
                            if (valuesValueValue.length) {
                                if (!valuesValueValue.includes(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' value must be one of '${valuesValueValue.join(`', '`)}'.`, `21`, 2))
                                    return
                                }
                            }
                            break
                        case `existPath`:
                            validOptionTypes = [ `String` ]
                            validValueTypes = [ `Boolean` ]

                            run = isValid(optionName, optionValue, optionValueType, valuesValueName, valuesValueValue, valuesValueValueType, validOptionTypes, validValueTypes)
                            if (run.dumpLevel) {
                                resolve(func.err(run.data, `22`, run.dumpLevel))
                                return
                            }

                            if (!valuesValueValue) {
                                if (this.isExistsPath(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' (${optionValue}) path must be not exists, because 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue.toString()}).`, `23`, 2))
                                    return
                                }
                            } else {
                                if (!this.isExistsPath(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' (${optionValue}) path must be exists, because 'availableValues.${optionName}.${valuesValueName}' (${valuesValueValue.toString()}).`, `24`, 2))
                                    return
                                }
                            }
                            break
                        default:
                            resolve(func.err(`'options.availableValues.${optionName}' can contain 'min', 'max', 'minLength', 'maxLength', 'values', 'existPath', 'mustBePositiveNum', 'mustBeNegativeNum' options. '${valuesValueName}' given.`, `25`, 1))
                            return
                    }
                }
            }
            resolve(func.succ(true))
            return
        })
    }

    /**
     * @arg {object} @param object.options - Default: {}
     * @arg {object} @param object.default - Default: {}
     * @arg {object} @param object.types - Default: {}
     * @arg {boolean} @param object.defaultMatch - Default: false
     * @arg {boolean} @param object.defaultPrimary - Default: false
     * @arg {boolean} @param object.defaultPure - Default: false
     * @arg {boolean} @param object.typesMatch - Default: false
     * @arg {boolean} @param object.valuesMatch - Default: false
     * 
     * @returns {promise} 
     */
    static validate = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->validate`, opt)
                .args()

            if (this.getType(func.opt.options) !== `Object`) func.opt.options = {}
            if (this.getType(func.opt.default) !== `Object`) func.opt.default = {}
            if (this.getType(func.opt.types) !== `Object`) func.opt.types = {}
            if (this.getType(func.opt.values) !== `Object`) func.opt.values = {}
            if (this.getType(func.opt.defaultMatch) !== `Boolean`) func.opt.defaultMatch = false
            if (this.getType(func.opt.defaultPrimary) !== `Boolean`) func.opt.defaultPrimary = false
            if (this.getType(func.opt.defaultPure) !== `Boolean`) func.opt.defaultPure = false
            if (this.getType(func.opt.typesMatch) !== `Boolean`) func.opt.typesMatch = false
            if (this.getType(func.opt.valuesMatch) !== `Boolean`) func.opt.valuesMatch = false

            let run
            run = await this.getDefaultOptions(func, func.opt.options, func.opt.default, { defaultMatch: func.opt.defaultMatch, defaultPrimary: func.opt.defaultPrimary, defaultPure: func.opt.defaultPure })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            func.opt.options = run.data
            run = await this.isAvailableTypes(func, func.opt.options, func.opt.types, { typesMatch: func.opt.typesMatch })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            run = await this.isAvailableValues(func, func.opt.options, func.opt.values, { valuesMatch: func.opt.valuesMatch })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            resolve(func.succ(func.opt.options))
            return
        })
    }

    /**
     * @arg {string} @param data  - Required. String where need to remove secure words.
     * @arg {array} @param secureWords  - Default: []. Secure words.
     * 
     * @returns {promise}
     */
    secure = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->secure`, opt)
                .args(`data`)
                .args(`secureWords`)

            func.default = {
                secureWords: []
            }

            func.types = {
                data: [ `String` ],
                secureWords: [ `Array` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }

            for (let secureWord of func.opt.secureWords) {
                if (this.getType(secureWord) === `String`) func.opt.data = func.opt.data.replaceAll(secureWord, ``)
            }
            resolve(func.succ(func.opt.data))
            return
        })
    }

    /**
     * @arg {string} @param cmd  - Required.
     * @arg {array} @param secureWords  - Default: []. Secure words.
     * 
     * @returns {promise}
     */
    execCmd = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->execCmd`, opt)
                .args(`cmd`)
                .args(`secureWords`)
            
            func.default = {
                secureWords: []
            }

            func.types = {
                cmd: [ `String` ],
                secureWords: [ `Array` ]
            }

            await func.validate({ defaultPure: true })
            if (func.result.error) { resolve(func.err()); return }

            exec(func.opt.cmd, async (err, stdout, stderr) => {
                let output = ``
                if (err) output += err.message
                if (stdout) output += `\n` + stdout
                if (stderr) output += `\n` + stderr

                if (func.opt.secureWords.length) {
                    let run = await this.secure(output, func.opt.secureWords)
                    if (run.error) { resolve(func.err(run)); return }
                    output = run.data
                }

                resolve(func.succ(output))
                return
            })
            return
        })
    }

    /**
     * @arg {function} @param func - Default: () => {}.
     * @arg {array} @param args  - Default: [].
     * @arg {array} @param secureWords - Default: []. Secure words.
     * 
     * @returns {promise}
     */
    static try = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->try`, opt)
                .args(`func`)
                .args(`args`)
                .args(`secureWords`)

            func.default = {
                func: () => {},
                args: [],
                secureWords: []
            }

            func.types = {
                func: [ `Function` ],
                args: [ `Array` ],
                secureWords: [ `Array` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }

            let run, run2
            try { 
                run = func.opt.func.apply(this, func.opt.args)
                if (func.opt.secureWords.length && this.getType(run) === `String`) {
                    run2 = this.secure(run, func.opt.secureWords)
                    if (run2.error) { resolve(func.err(run2)); return }
                    run = run2.data
                }
                resolve(func.succ(run))
            } catch (error) {
                error = error.toString()
                if (func.opt.secureWords.length && this.getType(error) === `String`) {
                    run2 = this.secure(error, func.opt.secureWords)
                    if (run2.error) { resolve(func.err(run2)); return }
                    error = run2.data
                }
                resolve(func.err(error, `1`, 2))
            }
            return
        })
    }

    /**
     * @arg {number/string} @param num - Required.
     * @arg {boolean} @param object.mustBePositive - Default: false.
     * @arg {boolean} @param object.mustBeNegative - Default: false.
     * 
     * @returns {promise}
     */
    static isNum = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isNum`, opt)
                .args(`num`)
                .args()

            func.default = {
                mustBePositive: false,
                mustBeNegative: false
            }

            func.types = {
                num: [ `Number`, `String` ],
                mustBePositive: [ `Boolean` ],
                mustBeNegative: [ `Boolean` ],
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }

            func.opt.num = func.opt.num.toString()
            let availableChars = [ `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` ]
            let chars = func.opt.num.split(``)
            let i = 0
            for (let char of chars) {
                i++
                if (char === `-` && i !== 1) { resolve(func.succ(false)); return }
                if (!availableChars.includes(char)) { resolve(func.succ(false)); return }
            }
            if (func.opt.mustBePositive && BigInt(func.opt.num) < BigInt(`0`)) { resolve(func.succ(false)); return }
            if (func.opt.mustBeNegative && BigInt(func.opt.num) >= BigInt(`0`)) { resolve(func.succ(false)); return }
            resolve(func.succ(true))
            return
        })
    }

    /**
     * @arg {number} @param min  - Default: 0. For define min value.
     * @arg {number} @param max  - Default: 1. For define max value.
     * 
     * @returns {promise}
     */
    static getRandInt = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getRandInt`, opt)
                .args(`min`)
                .args(`max`)

            func.default = {
                min: 0,
                max: 1
            }

            func.types = {
                min: [ `Number` ],
                max: [ `Number` ]
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }
            resolve(func.succ(Math.floor(Math.random() * (func.opt.max - func.opt.min + 1) + func.opt.min)))
            return
        })
    }

    /**
     * @arg {number} @param length  - Default: 13. For define result length.
     * @arg {string} @param object.letterCase  - Default: 'lower'. Can be 'lower', 'upper', 'mixed'.
     * @arg {array} @param object.lettersLib  - Default: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ].
     * @arg {array} @param object.numbersLib - Default: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ].
     * @arg {array} @param object.specialLib - Default: [ '!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', ':', ',', '.', ';', '[', ']', '{', '}', '<', '>' ].
     * @arg {array} @param object.customLib - Default: [].
     * @arg {boolean} @param object.lettersEnable - Default: true.
     * @arg {boolean} @param object.numbersEnable - Default: true.
     * @arg {boolean} @param object.specialEnable - Default: false.
     * @arg {boolean} @param object.customEnable - Default: true.
     * 
     * @returns {promise}
     */
    static getRandStr = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getRandStr`, opt)
                .args(`length`)
                .args()
            
            func.default = {
                length: 13,
                letterCase: `lower`,
                lettersLib: [ `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z` ],
                numbersLib: [ `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` ],
                specialLib: [ `!`, `@`, `#`, `$`, `%`, `&`, `*`, `(`, `)`, `-`, `_`, `+`, `:`, `,`, `.`, `;`, `[`, `]`, `{`, `}`, `<`, `>` ],
                customLib: [],
                lettersEnable: true,
                numbersEnable: true,
                specialEnable: false,
                customEnable: false
            }

            func.types = {
                letterCase: [ `String` ],
                lettersLib: [ `Array` ],
                numbersLib: [ `Array` ],
                specialLib: [ `Array` ],
                customLib: [ `Array` ],
                lettersEnable: [ `Boolean` ],
                numbersEnable: [ `Boolean` ],
                specialEnable: [ `Boolean` ],
                customEnable: [ `Boolean` ],
            }

            await func.validate()
            if (func.result.error) { resolve(func.err()); return }

            let lib = []
            if (func.opt.lettersEnable) lib.concat(func.opt.lettersLib)
            if (func.opt.numbersEnable) lib.concat(func.opt.numbersLib)
            if (func.opt.specialEnable) lib.concat(func.opt.specialLib)
            if (func.opt.customEnable) lib.concat(func.opt.customLib)

            let string = ``
            for (let i = 0; i < func.opt.length; i++) {
                let char = lib[Math.floor(Math.random() * lib.length)]
                if (options.letterCase === 'lower') {
                    char = char.toLowerCase()
                } else if (options.letterCase === 'upper') {
                    char = char.toUpperCase()
                } else {
                    if (Math.floor(Math.random() * 2)) {
                        char = char.toLowerCase()
                    } else {
                        char = char.toUpperCase()
                    }
                }
                string += char
            }
            resolve(func.succ(string))
            return
        })
    }
}