import { unlinkSync, rmSync } from 'fs'
import { Readable, Writable } from 'stream'
import corelight from '../index'

export default class {
    constructor(...opt) {
        this._iter = opt[0]
        this._self = `func`
        this._initiator = opt[1]
        this._name = opt[2]
        this._argums = opt[3]
        this._dumpLevel = opt[4]
        this._dumpFunc = opt[5]
        this._default = {}
        this._types = {}
        this._values = {}
        this._opt = {}
        this._result = {
            data: null,
            error: null,
            dump: opt[6]
        }
    }

    /**
     * @param {string} @arg name - Default: 'Unknown'. For define function name.
     * @param {any} @arg argums - Default: none. For define argums.
     * @param {boolean} @arg object.dumpSplit - Default: false. Define true, if need to split dump.
     * @param {number} @arg object.dumpLevel - Default: 0. For define dump level.
     * @param {function/null} @arg object.dumpFunc - Default: null. For define dump function.
     * 
     * @returns {object} this
     */
    static init = (...opt) => {
        let isSame = (obj) => {
            if (corelight.getType(obj.self) === `String` && obj.self === `func`) return true
            return false
        }
        
        let isSettings = (obj) => {
            let keys = Object.keys(obj)
            if (!keys.length || keys.length > 4) return false
            if (!keys.includes(`dumpLevel`) && !keys.includes(`dumpFunc`) && !keys.includes(`dumpLeve`) && !keys.includes(`initiator`)) return false
            return true
        }
    
        let iter = 1
        let initiator = `Unknown`
        let name = `Unknown`
        let argums = []
        let dumpLevel = 1 // 0: Nothing, 1: Errors only, 2: Errors & Warnings, 3: Errors & Warnings & Notifications.
        let dumpFunc = null
        let func = null
    
        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `String` && name === `Unknown`) {
                name = optVal
            } else if (optValType === `Object` && isSame(optVal)) {
                func = optVal
            } else if (optValType === `Object` && !isSettings(optVal)) {
                argums.push(optVal)
            } else if (optValType !== `Array` && optValType !== `Object`) {
                argums.push(optVal)
            }
        }
        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `Array`) {
                for (let optVal2 of optVal) {
                    let optVal2Type = corelight.getType(optVal2)
                    if (optVal2Type === `Object` && isSame(optVal2)) {
                        func = optVal2
                    }
                }
                for (let optVal2 of optVal) {
                    let optVal2Type = corelight.getType(optVal2)
                    if (optVal2Type === `Object` && !isSame(optVal2) && !isSettings(optVal2)) {
                        argums.push(optVal2)
                    } else if (optVal2Type !== `Object`) {
                        argums.push(optVal2)
                    }
                }
            }
        }
        if (func) {
            iter = func.iter + 1
            initiator = `${func.initiator}->${func.name}`
            dumpLevel = func.dumpLevel
            dumpFunc = func.dumpFunc
        }
    
        let dumpSplit = false
        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `Object` && isSettings(optVal)) {
                if (corelight.getType(optVal.dumpLevel) === `Number`) dumpLevel = optVal.dumpLevel
                if (corelight.getType(optVal.dumpFunc) === `Function` || corelight.getType(optVal.dumpFunc) === `Null`) dumpFunc = optVal.dumpFunc
                if (corelight.getType(optVal.dumpSplit) === `Boolean`) dumpSplit = optVal.dumpSplit
                if (corelight.getType(optVal.initiator) === `String`) initiator = optVal.initiator
            }
        }
        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `Array`) {
                for (let optVal2 of optVal) {
                    let optVal2Type = corelight.getType(optVal2)
                    if (optVal2Type === `Object` && isSettings(optVal2)) {
                        if (corelight.getType(optVal2.dumpLevel) === `Number`) dumpLevel = optVal2.dumpLevel
                        if (corelight.getType(optVal2.dumpFunc) === `Function` || corelight.getType(optVal2.dumpFunc) === `Null`) dumpFunc = optVal2.dumpFunc
                        if (corelight.getType(optVal2.dumpSplit) === `Boolean`) dumpSplit = optVal2.dumpSplit
                        if (corelight.getType(optVal2.initiator) === `String`) initiator = optVal2.initiator
                    }
                }
            }
        }
        let dump = []
        if (func) dumpSplit ? dump = [ ...func.result.dump ] : dump = func.result.dump
        let self = new this(iter, initiator, name, argums, dumpLevel, dumpFunc, dump)
        self.dump(`Started.`, 3)
        return self
    }

    get iter() { return this._iter }
    get initiator() { return this._initiator }
    get self() { return this._self }
    get name() { return this._name }
    get argums() { return this._argums }
    get result() { return this._result }

    get opt() { return this._opt }
    get default() { return this._default }
    get types() { return this._types }
    get values() { return this._values }
    get dumpLevel() { return this._dumpLevel }
    get dumpFunc() { return this._dumpFunc }

    set opt(value) { this._opt = value }
    set default(value) { this._default = value }
    set types(value) { this._types = value }
    set values(value) { this._values = value }
    set dumpLevel(value) { this._dumpLevel = value }
    set dumpFunc(value) { this._dumpFunc = value }

    /**
     * @param {undefined/boolean/number/string/null} @arg value - Default: ''. Data for dumping.
     * @param {number} @arg dumpLevel - Default: 3. For define dump level.
     * @param {function/null} @arg dumpFunc - Default: this.dumpFunc. For define dump function.
     * 
     * @returns {object} this
     */
    dump = (...opt) => {
        let value = ``
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc
        let msg = ``
        let type = `Notify`

        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `Number`) dumpLevel = optVal
            if (optValType === `Function` || optValType === `Null`) dumpFunc = optVal
        }

        if (dumpLevel === 2) type = `Warning`
        if (dumpLevel === 1) type = `Error`

        if (!opt.length) {
            if (this.dumpLevel > 0) {
                msg = `${this.initiator}->${this.name} (${type}): Function 'dump' error. Arguments is empty.`
                this.result.dump.push(msg)
                if (dumpFunc) dumpFunc(msg)
            }
            return this
        }

        if (dumpLevel <= this.dumpLevel) {
            value = opt.shift()

            let valueType = corelight.getType(value)
            let typesToString = [ `Undefined`, `Boolean`, `Number`, `String`, `Null` ]
            if (!typesToString.includes(valueType)) {
                msg = `${this.initiator}->${this.name} (${type}): Function 'dump' error. Value type: '${valueType}' instead '${typesToString.join(`' ,'`)}'.`
            } else {
                msg = `${this.initiator}->${this.name} (${type}): ${value.toString()}`
            }
    
            this.result.dump.push(msg)
            if (dumpFunc) dumpFunc(msg)
        }

        return this
    }

    /**
     * @param {any} @arg value - Default: null. Data for return.
     * @param {number} @arg dumpLevel - Default: 3. For define dump level.
     * @param {function/null} @arg dumpFunc - Default: this.dumpFunc. For define dump function.
     * 
     * @returns {object} this
     */
    succ = (...opt) => {
        let value = this.result.data
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc

        let i = 0
        for (let optValue of opt) {
            i++
            if (i === 1) {
                if (corelight.getType(optValue) === `Object` && corelight.getType(optValue.data) !== `Undefined` && corelight.getType(optValue.error) !== `Undefined`) {
                    value = optValue.data
                } else {
                    value = optValue
                }
            } else if (corelight.getType(optValue) === `Number`) {
                dumpLevel = optValue
            } else if (corelight.getType(optValue) === `Function` || corelight.getType(optValue) === `Null`) {
                dumpFunc = optValue
            }
        }

        this.result.data = value

        if (dumpLevel <= this.dumpLevel) {
            let msg = ``
            let dataType = corelight.getType(this.result.data)
            let typesToString = [ `Undefined`, `Boolean`, `Number`, `String`, `Null` ]
            if (typesToString.includes(dataType)) {
                msg = `Data type: ${dataType}. Data: ${this.result.data.toString()}.`
            } else if (this.result.data instanceof Readable) {
                msg = `Data type: Readable. Path: ${this.result.data.path}.`
            } else if (this.result.data instanceof Writable) {
                msg = `Data type: Writable. Path: ${this.result.data.path}.`
            } else if (dataType === `Object`) {
                msg = `Data type: ${dataType}. Data: ${JSON.stringify(this.result.data)}.`
            } else {
                msg = `Data type: ${dataType}.`
            }
            this.dump(msg, dumpLevel, dumpFunc)
            this.dump(`Success.`, dumpLevel, dumpFunc)
        }

        return this.result
    }

    /**
     * @param {string} @arg message - Default: ''. For define error message.
     * @param {string} @arg code - Default: '0'. For define error code.
     * @param {number} @arg dumpLevel - Default: 3. For define dump level.
     * @param {function/null} @arg dumpFunc - Default: this.dumpFunc. For define dump function.
     * 
     * @returns {object} this
     */
    err = (...opt) => {
        let message = ``
        let code = `0`
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc

        if (this.result.error) {
            if (corelight.getType(this.result.error.message) === `String`) {
                message = this.result.error.message
            }
            if (corelight.getType(this.result.error.code) === `String`) {
                code = this.result.error.code
            }
        }

        let stringCount = 0
        let toRemove, isRemove = null
        for (let optVal of opt) {
            let optValType = corelight.getType(optVal)
            if (optValType === `String`) {
                stringCount++
                if (stringCount === 1) {
                    message = optVal
                } else if (stringCount === 2) {
                    code = optVal
                }
            } else if (optValType === `Number`) {
                dumpLevel = optVal
            } else if (optValType === `Function` || optValType === `Null`) {
                dumpFunc = optVal
            } else if (optValType === `Object` && corelight.getType(optVal.data) !== `Undefined` && corelight.getType(optVal.error) === `Object`) {
                if (corelight.getType(optVal.error.message) === `String`) {
                    message = optVal.error.message
                }
                if (corelight.getType(optVal.error.code) === `String`) {
                    code = optVal.error.code
                }
            } else if (optValType === `Array`) {
                toRemove = optVal
            } else if (optValType === `Boolean`) {
                isRemove = optVal
            }
        }

        if (isRemove) {
            if (corelight.getType(toRemove) === `Array`) {
                for (let pathToRemove of toRemove) {
                    if (corelight.getType(pathToRemove) === `String`) {
                        try { unlinkSync(pathToRemove) } catch (e) {}
                        try { rmSync(pathToRemove, { recursive: true }) } catch (e) {}
                    }
                }
            }
        }

        this.result.error = { code, message }

        if (dumpLevel <= this.dumpLevel) {
            this.dump(`Error code: ${this.result.error.code}. Error message: ${this.result.error.message}`, dumpLevel, dumpFunc)
        }

        return this.result
    }

    /**
     * @param {string/array} @arg value - Default: none. For define option in this.opt from this.argums.
     * 
     * @returns {object} this
     */
    args = (...opt) => {
        if (!opt.length) {
            let i = 0
            for (let argumValue of this.argums) {
                if (corelight.getType(argumValue) === `Object`) {
                    for (const argumValueName in argumValue) {
                        this.opt[argumValueName] = argumValue[argumValueName]
                    }
                    this._argums.shift()
                } else {
                    i++
                    this.opt[`arg${i}`] = this._argums.shift()
                }
            }
        } else {
            for (let optVal of opt) {
                let optValType = corelight.getType(optVal)
                if (optValType === `String`) {
                    if (this.argums.length) {
                        this.opt[optVal] = this._argums.shift()
                    } else {
                        this.opt[optVal] = undefined
                    }
                } else if (optValType === `Array`) {
                    for (let optVal2 of optVal) {
                        if (corelight.getType(optVal2) === `String`) {
                            if (this.argums.length) {
                                this.opt[optVal2] = this._argums.shift()
                            } else {
                                this.opt[optVal2] = undefined
                            }
                        }
                    }
                }
            }
        }

        return this
    }

    /**
     * @param {boolean} @arg object_1.defaultMatch - Default: false.
     * @param {boolean} @arg object_1.defaultPrimary - Default: false.
     * @param {boolean} @arg object_1.defaultPure - Default: false.
     * @param {boolean} @arg object_1.typesMatch - Default: false.
     * @param {boolean} @arg object_1.valuesMatch - Default: false.
     * @param {number} @arg dumpLevel - Default: this.dumpLevel. For define dump level.
     * @param {function/null} @arg dumpFunc - Default: this.dumpFunc. For define dump function.
     * 
     * @returns {promise} this
     */
    validate = (...opt) => {
        return new Promise(async (resolve) => {
            let defaultMatch = false
            let defaultPrimary = false
            let defaultPure = false
            let typesMatch = false
            let valuesMatch = false
            let dumpLevel = this.dumpLevel
            let dumpFunc = this.dumpFunc
            let run

            for (let optVal of opt) {
                let optValType = corelight.getType(optVal)
                if (optValType === `Object`) {
                    if (corelight.getType(optVal.defaultMatch) === `Boolean`) {
                        defaultMatch = optVal.defaultMatch
                    }
                    if (corelight.getType(optVal.defaultPrimary) === `Boolean`) {
                        defaultPrimary = optVal.defaultPrimary
                    }
                    if (corelight.getType(optVal.defaultPure) === `Boolean`) {
                        defaultPure = optVal.defaultPure
                    }
                    if (corelight.getType(optVal.typesMatch) === `Boolean`) {
                        typesMatch = optVal.typesMatch
                    }
                    if (corelight.getType(optVal.valuesMatch) === `Boolean`) {
                        valuesMatch = optVal.valuesMatch
                    }
                } else if (optValType === `Number`) {
                    dumpLevel = optVal
                } else if (corelight.getType(optVal.dumpFunc) === `Function` || corelight.getType(optVal.dumpFunc) === `Null`) {
                    dumpFunc = optVal.dumpFunc
                }
            }
            if (corelight.getType(this.default) !== `Object`) {
                resolve(this.err(`'func.default' must be type of 'Object'. '${corelight.getType(this.default)}' given.`, `1`, 1))
                return
            }
            if (corelight.getType(this.types) !== `Object`) {
                resolve(this.err(`'func.types' must be type of 'Object'. '${corelight.getType(this.types)}' given.`, `2`, 1))
                return
            }
            if (corelight.getType(this.values) !== `Object`) {
                resolve(this.err(`'func.values' must be type of 'Object'. '${corelight.getType(this.values)}' given.`, `3`, 1))
                return
            }
            run = await corelight.validate(this, { options: this.opt, default: this.default, types: this.types, values: this.values, defaultMatch, defaultPrimary, defaultPure, typesMatch, valuesMatch }, { dumpLevel, dumpFunc })
            if (run.error) {
                resolve(this.err(run))
                return
            }
            this.opt = run.data
            resolve(this)
            return
        })
    }
}