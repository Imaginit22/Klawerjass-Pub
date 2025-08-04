function lose(oppCard, povCard, body, hoistedData) {
    console.log(oppCard, povCard)
    const tricks = oppCard + povCard
    let spl1ndex
    if (hoistedData.hand1.indexOf(body.card) != undefined) {
    spl1ndex = hoistedData.hand1.indexOf(body.card)
    } else {
    spl1ndex = hoistedData.hand1.indexOf(hoistedData.played)
    }
    let spl2ndex
    if (hoistedData.hand2.indexOf(body.card) != undefined) {
    spl2ndex = hoistedData.hand2.indexOf(body.card)
    } else {
    spl2ndex = hoistedData.hand2.indexOf(hoistedData.played)
    }
    if (spl1ndex != -1) {
        console.log("removing from hand 1", spl1ndex)
        hoistedData.hand1.splice(spl1ndex, 1)
    }
    if (spl2ndex != -1) {
        console.log("removing from hand 2", spl2ndex)
        hoistedData.hand2.splice(spl2ndex, 1)
    }
    console.log(tricks, hoistedData.tricks, "DATARIC")
    return tricks
}