var level = require('level');
var database = level('database');

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function NotNumberCheck(value) {
    if (!isNumeric(value) || value === undefined || value === null) {
        value = 0;
    }
    return parseInt(value);
}

async function get(key) {
    try {
        let res = await database.get(key);
        if (isNumeric(res)) {
            return NotNumberCheck(res);
        }
        return res;
    } catch (err) {
        return 0;
    }
}

async function has(key) {
    try {
        let res = await database.get(key);
        if (res === null || res === undefined) {
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }
}

async function del(key) {
    try {
        await database.del(key);
    } catch (err) {
        return false;
    }
}

async function set(key, Value) {
    try {
        let HasKey = await has(key);
        if (HasKey) {
            await database.put(key, `${Value}`, async function (err) {
                if (err) {
                    return false;
                }
                return true;
            })
        }
        else {
            await database.put(key, `${Value}`, async function (err) {
                if (err) {
                    return false;
                }
                return true;
            })
        }
    } catch (err) {
        return false;
    }
}

async function add(key, Value) {
    try {
        if (!isNumeric(Value)) {
            return false;
        }

        Value = NotNumberCheck(Value);
        await database.get(key, async function (err, value) {
            if (err) {
                return await set(key, Value);
            }

            if (isNumeric(value)) {
                value = NotNumberCheck(value);
                Value += value;
                return await set(key, Value);
            }
        });
    } catch (err) {
        return false;
    }
}

async function subtract(key, Value) {
    try {
        if (!isNumeric(Value)) {
            return false;
        }

        Value = NotNumberCheck(Value);
        await database.get(key, async function (err, value) {
            if (err) {
                await set(key, 0);
            }

            if (isNumeric(value)) {
                value = NotNumberCheck(value);
                value -= Value;
                await set(key, value);
            }
        });
    } catch (err) {
        return false;
    }
}


module.exports.has = has;
module.exports.set = set;
module.exports.del = del;
module.exports.get = get;
module.exports.add = add;
module.exports.subtract = subtract;