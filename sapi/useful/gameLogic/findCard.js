function findCard(key, map) {
    console.log("HE OTHER< COOLOR ONE")
    let temp = map.get(key[0]);
    if (temp == undefined) {
        return key;
    } else {
        return temp;
    }
}
module.exports = findCard
