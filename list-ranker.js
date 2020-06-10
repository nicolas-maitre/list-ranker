Element.prototype.addElement = function (type = "div", attributes = {}) {
    var elem = document.createElement(type);
    this.appendChild(elem);
    for (var indAttr in attributes) {
        elem.setAttribute(indAttr, attributes[indAttr]);
    }
    //special attributes (setters/other)
    if (attributes._text) elem.textContent = attributes._text;
    if (attributes._html) elem.innerHTML = attributes._html;
    return elem;
};
Element.prototype.removeChilds = function (elemQuerySelector = false) {
    if (elemQuerySelector) {
        var elemsToRemove = [...this.querySelectorAll(elemQuerySelector)]
    } else {
        var elemsToRemove = [...this.childNodes];
    }
    elemsToRemove.forEach((elem) => {
        elem.remove();
    });
};

//var entriesList = ["3", "4", "7", "1", "5", "2", "6"];
var entriesList = [];
var progressRefsList = [];
var totalQuestions = 0;
var itemsCount = 0;
var indProgress = 0;
var indA = 0;
var indB = 0;


newEntryForm.addEventListener("submit", evt => {
    evt.preventDefault();
    var newEntry = newEntryInput.value;
    entriesList.push(newEntry);
    newEntriesList.addElement("p", { class: "newEntry", _text: `${entriesList.length}: ${newEntry}` });
    newEntryForm.reset();
    newEntryInput.focus();
    showRankSectionBtn.disabled = false;
});
showRankSectionBtn.addEventListener("click", evt => {
    enterListSection.classList.add("none");
    rankSection.classList.remove("none");
    startRanking();
});
function startRanking() {
    progressRefsList = [...entriesList.keys()];
    itemsCount = entriesList.length
    totalQuestions = (itemsCount * itemsCount + itemsCount) / 2 - itemsCount;
    totalDisplay.textContent = totalQuestions;
    rankingProcess();
}
function rankingProcess() {
    progressDisplay.textContent = indProgress + 1;
    //preview
    listPreview.removeChilds();
    for (var ind = 0; ind < progressRefsList.length; ind++) {
        if (ind)
            listPreview.addElement("span", { _text: ", " });
        listPreview.addElement("b", { class: "previewItem", _text: entriesList[progressRefsList[ind]] });
    }
    //indexs update
    indB++;
    if (indB >= itemsCount) {
        indA++;
        indB = indA + 1;
    }
    //display
    choiceA.textContent = entriesList[indA];
    choiceB.textContent = entriesList[indB];
}
choiceA.addEventListener("click", evt => {
    chooseProposition(true);
});
choiceB.addEventListener("click", evt => {
    chooseProposition(false);
});
function chooseProposition(isA) {
    //sort
    let supVal = isA?indA:indB;
    let subVal = isA?indB:indA;
    let subInd = progressRefsList.indexOf(subVal);
    let supInd = progressRefsList.indexOf(supVal);
    if(subInd < supInd){
        console.log("ho");
        progressRefsList.splice(supInd, 1);//remove sup
        progressRefsList.splice(subInd, 0, supVal)//readd sup before sub
    }

    //next
    indProgress++;
    if (indProgress >= totalQuestions) {
        showResults();
        return;
    }
    rankingProcess();
}
function showResults() {
    rankSection.classList.add("none");
    resultSection.classList.remove("none");
    //display
    resultsList.removeChilds();
    for (var indRes = 0; indRes < progressRefsList.length; indRes++) {
        let resDiv = resultsList.addElement("p", { class: "resultItem" });
        resDiv.addElement("b", { _text: `${indRes + 1}: ` });
        resDiv.addElement("span", { _text: entriesList[progressRefsList[indRes]] });
    }
}
restartBtn.addEventListener("click", restart);
function restart() {
    entriesList = [];
    indProgress = 0;
    indA = 0;
    indB = 0;
    //display
    newEntriesList.removeChilds();
    resultSection.classList.add("none");
    enterListSection.classList.remove("none");
    newEntryForm.reset();
    newEntryInput.focus();
}