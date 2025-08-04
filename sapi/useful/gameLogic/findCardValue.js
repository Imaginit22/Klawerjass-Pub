function findCardValue(key, trumps, map) {
    let temp = map.get(key[0]);
    if (key[1] == trumps) {
        if (key[0] == 'J') {
        temp += 18
        } else if (key[0] == '9') {
        temp += 14
        }
    }
    if (temp == undefined) {
        return key;
    } else {
        return temp;
    }
}
module.exports = {findCardValue}