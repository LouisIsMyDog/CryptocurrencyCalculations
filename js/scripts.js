//*******// Author: Emre
//*************************//
// set pageVariables
var pageVariables;
function setPageVariables() {
    pageVariables = {
        window: null,
        profitClassRemoved: null,
        profit: document.getElementsByClassName('order-2')[0],
        buy: document.getElementsByClassName('order-1')[0],
        sell: document.getElementsByClassName('order-3')[0],
        exchangeButton: document.getElementById('exchangeButton'),
        exchangeActive: function() {
            return pageVariables.buttonStatus("exchangeActive", this); },
        btcButton: document.getElementById('btcButton'),
        btcActive: function() {
            return pageVariables.buttonStatus("btcActive", this); }, 
        dollarBuyTop: {
            buy: ["buy_usd", "buy_rate", "buy_fee"],
            sell: ["sell_rate"]
        },
        dollarSellTop: {
            sell: ["sell_holdings", "sell_rate", "sell_fee"],
            buy: ["buy_rate"]
        },
        currentInputFields: [],
        inputForm: [],
        buttonStatus: function(property, object) {
            let x = Object.getOwnPropertyNames(this);
            let y = extractWord(property);
            var r = [];
            x.forEach(function(e) {
                if (findObjProperty(y, e)) {
                    if (this[e] != undefined && typeof this[e] != "boolean") {
                        r = object[e].getAttribute("aria-pressed");
                        r = balloon(r);
                    }
                }
            });
            return r;
        }
    };
}
setPageVariables();
setCurrentInputFields();
// set the pageVariables
//*************************//
// Object with form functions
function inputValues() {
    this.run = function() {
        pageVariables.inputForm = [];
        formFunctions();
    };
}
form = new inputValues();
form.run();
//*************************//
/*EVENTS*/
//*************************//
// When input is entered
function onChange() {
    form.run();
}
//*************************//
// add button to pagevariables
pageVariables.exchangeButton.onclick = function() {
    setTimeout(buttonEvent, 1);
};
//*************************//
// functions triggered when event occurs
function buttonEvent() {
    switchBuySell();
    switchReadOnly();
    resetForm();
    resetInputGroupAddon();
    inputGroupAddOn();
}
//*************************//
// Changes arrangement of boxes for different screen sizes
document.body.onresize = function() {
    changeBootstrapOrdering()
};
changeBootstrapOrdering();
//*************************************************************************//
//*************************//
// fire up each function in order to make the app work
function formFunctions() {
    log("- - - - - -")
    let a;
    // Buy cardOne Sell cardTwo
    // Sell CardOne Sell cardTwo
    a = (!pageVariables.exchangeActive()) ? pageVariables.dollarBuyTop.buy : pageVariables.dollarSellTop.sell;
    setcardOneValues(a);
    // buy_usd, buy_rate, buy_fee
    // sell_holdings, sell_rate, sell_fee
    a = (!pageVariables.exchangeActive()) ? pageVariables.dollarBuyTop.sell : pageVariables.dollarSellTop.buy;
    setcardTwoValues(a);
    // sell_rate
    // buy_rate
    calculate_card_one();
    // buy_fee_dollar, buy_received, buy_final_received
    // sell_fee_dollar, sell_usd, sell_final_received
    calculate_card_two();
    // sell_holdings, sell_usd, sell_fee, sell_fee_dollar, sell_final_usd
    // buy_usd, buy_received, buy_fee, buy_fee_dollar, buy_final_received
    calculate_profit();
    // earned, earned_percentage, total_fee
    addElementPropertyToForm();
    // add element selector to pageVariables.input
    insertValues();
    // add values to the html elements
    changeInputFormType();
    // change input form types to number
    cardColor();
    // changes color of card depending on profit or loss
    checkInputValue();
    // if buy_fee is empty or 0 the forms fee elements change accordingly
    if (!pageVariables.startedGroupAddOn) { // run only once
        inputGroupAddOn();
        pageVariables.startedGroupAddOn = 1;
    }
    // add symbols before input fields
    inputCopy();
    // adds copy to clipboard function
    log("pageVariables: ");
    log(pageVariables);
}
//*************************//
// snatch Card One inputs
function setcardOneValues(input = '') {
    input.forEach(function(element) {
        let elementValue = v(element);
        pushValuesOut({ name: element, value: (!isEmpty(elementValue)) ? elementValue : 0, isEmpty: isEmpty(elementValue) });
    });
}
//*************************//
// snatch Card Two inputs
function setcardTwoValues(input = '') {
    let elementValue = v(input[0]);
    pushValuesOut({ name: input[0], value: (!isEmpty(elementValue)) ? elementValue : 0, isEmpty: isEmpty(elementValue) });
}
//*************************//
// calculate the buy readonly fields
function calculate_card_one() {
    if (!pageVariables.exchangeActive()) {
        // if buy_fee exists
        // buy_fee_dollar = buy_usd * buy_fee
        if (retrieveElement("buy_fee").isEmpty == 0) {
            pushValuesOut({ name: "buy_fee_dollar", value: retrieveElement("buy_usd").value * retrieveElement("buy_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_fee_dollar", value: 0, isEmpty: 1 });
        }
        // if buy_usd and buy_rate exist
        // buy_received = buy_usd * buy_rate
        if (retrieveElement("buy_usd").isEmpty == 0 && retrieveElement("buy_rate").isEmpty == 0) {
            pushValuesOut({ name: "buy_received", value: retrieveElement("buy_usd").value / retrieveElement("buy_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_received", value: 0, isEmpty: 1 });
        }
        // if buy_received & buy_fee_dollar exist
        // buy_final_received = (buy_usd - buy_fee_dollar) / buy_rate
        if (retrieveElement("buy_received").isEmpty == 0 && retrieveElement("buy_fee_dollar").isEmpty == 0) {
            pushValuesOut({ name: "buy_final_received", value: (retrieveElement("buy_usd").value - retrieveElement("buy_fee_dollar").value) / retrieveElement("buy_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_final_received", value: 0, isEmpty: 1 });
        }
    } else { // ELSE*****
        // if sell_holdings and sell_rate exist
        // sell_usd = sell_holdings * sell_rate
        if (retrieveElement("sell_holdings").isEmpty == 0 && retrieveElement("sell_rate").isEmpty == 0) {
            pushValuesOut({ name: "sell_usd", value: retrieveElement("sell_holdings").value * retrieveElement("sell_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_usd", value: 0, isEmpty: 1 });
        }
        // if sell_fee exists
        // sell_fee_dollar = sell_usd * sell_fee
        if (retrieveElement("sell_fee").isEmpty == 0 && retrieveElement("sell_usd").isEmpty == 0) {
            pushValuesOut({ name: "sell_fee_dollar", value: retrieveElement("sell_usd").value * retrieveElement("sell_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_fee_dollar", value: 0, isEmpty: 1 });
        }
        // if sell_usd & sell_fee_dollar exist
        // sell_final_received = (sell_usd - buy_fee_dollar)
        if (retrieveElement("sell_usd").isEmpty == 0 && retrieveElement("sell_fee_dollar").isEmpty == 0) {
            pushValuesOut({ name: "sell_final_usd", value: (retrieveElement("sell_usd").value - retrieveElement("sell_fee_dollar").value), isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_final_usd", value: 0, isEmpty: 1 });
        }
    }
}
//*************************//
// calculate the sell readonly fields
function calculate_card_two() {
    if (!pageVariables.exchangeActive()) {
        // if buy_final_received exists
        // sell_holdings = buy_final_received
        if (retrieveElement("buy_final_received").isEmpty == 0) {
            pushValuesOut({ name: "sell_holdings", value: retrieveElement("buy_final_received").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_holdings", value: 0, isEmpty: 1 });
        }
        //  if sell_holdings & sell_rate exists
        // sell_usd = sell_holdings * sell_rate
        if (retrieveElement("sell_holdings").isEmpty == 0 && retrieveElement("sell_rate").isEmpty == 0) {
            // sell_usd = sell_holdings * sell_rate
            pushValuesOut({ name: "sell_usd", value: retrieveElement("sell_holdings").value * retrieveElement("sell_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_usd", value: 0, isEmpty: 1 });
        }
        // if buy_fee exists
        // sell_fee = buy_fee
        if (retrieveElement("buy_fee").isEmpty == 0) {
            // sell_fee = buy_fee
            pushValuesOut({ name: "sell_fee", value: retrieveElement("buy_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_fee", value: 0, isEmpty: 1 });
        }
        // if sell_usd & sell_fee exists
        // sell_fee_dollar = sell_usd * sell_fee
        if (retrieveElement("sell_usd").isEmpty == 0 && retrieveElement("sell_fee").isEmpty == 0) {
            pushValuesOut({ name: "sell_fee_dollar", value: retrieveElement("sell_usd").value * retrieveElement("sell_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_fee_dollar", value: 0, isEmpty: 1 });
        }
        // if sell_fee_dollar exists
        // sell_final_usd = sell_usd - sell_fee_dollar
        if (retrieveElement("sell_fee_dollar").isEmpty == 0) {
            pushValuesOut({ name: "sell_final_usd", value: retrieveElement("sell_usd").value - retrieveElement("sell_fee_dollar").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "sell_final_usd", value: 0, isEmpty: 1 });
        }
        // create array of variables
    } else { // ELSE*****
        // if sell_final_usd exists
        // buy_usd = sell_final_usd
        if (retrieveElement("sell_final_usd").isEmpty == 0) {
            pushValuesOut({ name: "buy_usd", value: retrieveElement("sell_final_usd").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_usd", value: 0, isEmpty: 1 });
        }
        //  if buy_usd & buy_rate exists
        // buy_received = buy_usd * buy_rate
        if (retrieveElement("buy_usd").isEmpty == 0 && retrieveElement("buy_rate").isEmpty == 0) {
            pushValuesOut({ name: "buy_received", value: retrieveElement("buy_usd").value / retrieveElement("buy_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_received", value: 0, isEmpty: 1 });
        }
        // if sell_fee exists
        // buy_fee = sell_fee
        if (retrieveElement("sell_fee").isEmpty == 0) {
            // buy_fee = sell_fee
            pushValuesOut({ name: "buy_fee", value: retrieveElement("sell_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_fee", value: 0, isEmpty: 1 });
        }
        // if buy_usd & buy_fee exists
        // buy_fee_dollar = buy_usd * buy_fee
        if (retrieveElement("buy_usd").isEmpty == 0 && retrieveElement("buy_fee").isEmpty == 0) {
            pushValuesOut({ name: "buy_fee_dollar", value: retrieveElement("buy_usd").value * retrieveElement("buy_fee").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_fee_dollar", value: 0, isEmpty: 1 });
        }
        // if buy_received exists
        // buy_final_received = buy_usd - buy_fee_dollar / buy_rate
        if (retrieveElement("buy_received").isEmpty == 0) {
            pushValuesOut({ name: "buy_final_received", value: (retrieveElement("buy_usd").value - retrieveElement("buy_fee_dollar").value) / retrieveElement("buy_rate").value, isEmpty: 0 });
        } else {
            pushValuesOut({ name: "buy_final_received", value: 0, isEmpty: 1 });
        }
    }
}
//*************************//
// calculate the profit readonly fields
function calculate_profit() {
    if (!pageVariables.exchangeActive()) {
        // if sell_final_usd exists
        if (retrieveElement("sell_final_usd").isEmpty == 0) {
            // earned = sell_final_usd - buy_usd
            pushValuesOut({ name: "earned", value: retrieveElement("sell_final_usd").value - retrieveElement("buy_usd").value, isEmpty: 0 });
            // earned_percentage = (sell_final_usd / buy_usd) - 1
            pushValuesOut({ name: "earned_percentage", value: (retrieveElement("sell_final_usd").value / retrieveElement("buy_usd").value) - 1, isEmpty: 0 });
            // total_fee = buy_fee_dollar + sell_fee_dollar
            pushValuesOut({ name: "total_fee", value: retrieveElement("buy_fee_dollar").value + retrieveElement("sell_fee_dollar").value, isEmpty: 0 });
        } else {
            pushValuesOut( [{ name: "earned", value: 0, isEmpty: 1 }, { name: "earned_percentage", value: 0, isEmpty: 1 }, { name: "total_fee", value: 0, isEmpty: 1 }] );
        }
    } else { // ELSE*****
        // if buy_final_received exists
        if (retrieveElement("buy_final_received").isEmpty == 0) {
            // earned = buy_final_received - sell_holdings
            pushValuesOut({ name: "earned", value: retrieveElement("buy_final_received").value - retrieveElement("sell_holdings").value, isEmpty: 0 });
            // earned_percentage = (buy_final_received / sell_holdings) - 1
            pushValuesOut({ name: "earned_percentage", value: (retrieveElement("buy_final_received").value / retrieveElement("sell_holdings").value) - 1, isEmpty: 0 });
            // total_fee = buy_fee_dollar + sell_fee_dollar
            pushValuesOut({ name: "total_fee", value: retrieveElement("buy_fee_dollar").value + retrieveElement("sell_fee_dollar").value, isEmpty: 0 });
        } else {
            pushValuesOut( [{ name: "earned", value: 0, isEmpty: 1 }, { name: "earned_percentage", value: 0, isEmpty: 1 }, { name: "total_fee", value: 0, isEmpty: 1 }] );
        }
    }
}
//*************************//
// format the form values to nicely formatted numbers
function formatOutput(name, value, skip = 0) {
    // edit output by formatting values
    if (value || skip == 1) {
        let dollarFormat = ["buy_fee_dollar", "sell_usd", "sell_fee_dollar", "sell_final_usd", "total_fee", (!pageVariables.exchangeActive()) ? "earned" : "buy_usd"];
        let percentageFormat = [(!pageVariables.exchangeActive()) ? "sell_fee" : "buy_fee", "earned_percentage"];
        let coinFormat = ["buy_received", "buy_final_received", "sell_holdings", (!pageVariables.exchangeActive()) ? null : "earned"];
        if (dollarFormat.includes(name)) {
            return formatValue(value, '$0,0.00');
        }
        if (percentageFormat.includes(name)) {
            return formatValue(value, '0.00[0]%');
        }
        if (coinFormat.includes(name)) {
            return formatValue(value, '[0,]0.[00000]');
        }
        return value;
    }
    return '';
}
//*************************//
// write the values onto the html
function insertValues() {
    let x = pageVariables.inputForm;
    if (!pageVariables.exchangeActive()) {
        var exclude = ["buy_usd", "buy_rate", "buy_fee", "sell_rate"];
    } else {
        var exclude = ["sell_holdings", "sell_rate", "sell_fee", "buy_rate"];
    }
    x.forEach(function(element) {
        if (!exclude.includes(element.name)) {
            element.element.value = formatOutput(element.name, element.value);
        }
    })
    pageVariables.userInputFields = exclude;
}
//*************************//
// change the order of buy card or sell card depending on the screen size
function changeBootstrapOrdering() {
    if (smallWindowSize()) {
        let a = pageVariables.profit;
        if (pageVariables.profitClassRemoved != 'yes') {
            a.classList.remove('order-2');
            a.classList.add('order-4');
            pageVariables.profitClassRemoved = 'yes';
        }
        pageVariables.window = 'small';
    } else {
        let a = pageVariables.profit;
        if (pageVariables.profitClassRemoved == 'yes') {
            a.classList.remove('order-4');
            a.classList.add('order-2');
            pageVariables.profitClassRemoved = 'no';
        }
        pageVariables.window = 'large';
    }
}
//*************************//
// change the color of the profit card depending on the money earned or "earned" input
function cardColor() {
    let a = pageVariables.profit.firstChild.nextSibling;
    let x = retrieveElement("earned").value;
    switch (true) {
        case (x > 0):
            a.classList.remove("card-alert", "card-default");
            a.classList.add("card-success");
            break;
        case (x < 0):
            a.classList.remove("card-success", "card-default");
            a.classList.add("card-alert");
            break;
        case (x == 0):
            a.classList.remove("card-alert", "card-success");
            a.classList.add("card-default");
            break;
    }
}
//*************************//
// switch cards buy and sell
function switchBuySell() {
    pageVariables.buy.classList.toggle('order-1');
    pageVariables.buy.classList.toggle('order-3');
    pageVariables.sell.classList.toggle('order-3');
    pageVariables.sell.classList.toggle('order-1');
}
//*************************//
// changefee() edits the values of the fee elements in the form
function changeFee(reset = 0) {
    let varFee = ["buy_fee_dollar", ( !pageVariables.exchangeActive() ) ? "sell_fee" : "buy_fee", "sell_fee_dollar", "total_fee"];
    if (reset == 0) {
        varFee.forEach(function(element) {
            document.getElementById(element).value = formatOutput(element, 0, 1);
        });
    } else if (reset == 1) {
        varFee.forEach(function(element) {
            document.getElementById(element).value = formatOutput(element, 0);
        });
    }
    return false;
}
//*************************//
// if buy_fee is empty or 0 the forms fee elements change accordingly
// or if the buy and sell events are neutral than the profits inputs are 0s
function checkInputValue() {
    if(!pageVariables.exchangeActive()) {
        if (retrieveElement("buy_fee").isEmpty == 0 && retrieveElement("buy_fee").value === 0 ) {
             changeFee();
        }
    } 
    if( pageVariables.exchangeActive() )  {
             if (retrieveElement("sell_fee").isEmpty == 0 && retrieveElement("sell_fee").value === 0 ) {
                 changeFee();
             }
    }
    if (retrieveElement("buy_fee").isEmpty == 1) {
        changeFee(reset = 1);
    }
    if (!document.getElementById("earned").value && !document.getElementById("earned_percentage").value && (retrieveElement("buy_final_received").isEmpty == 0 && retrieveElement("sell_final_usd").isEmpty == 0)) {
        if (!pageVariables.exchangeActive()) {
            document.getElementById("earned").value = formatOutput("earned", 0, 1);
            document.getElementById("earned_percentage").value = formatOutput("earned_percentage", 0, 1);
        } else {
            document.getElementById("earned").value = formatOutput("earned", 0);
            document.getElementById("earned_percentage").value = formatOutput("earned_percentage", 0);
        }
    }
}
//*************************//
function addElementPropertyToForm() {
    let y = pageVariables.inputForm;
    let elements = [];
    y.forEach(function(element) {
        elements.push(element.name);
    });
    for (i = 0; i < y.length; i++) {
        let x = retrieveElement(elements[i]);
        x.element = document.getElementById(elements[i]);
        y.shift();
        y.push(x);
    }
}
// sell inputs (holdings, rate, fee)
// buy inputs (buy rate)
// calculate coins earned
//*************************//
function switchReadOnly() {
    // on sell_holdings, sell_rate, sell_fee, buy_rate
    // off buy_usd, buy_fee
    // buy_rate & sell_rate need to always have readonly
    var toggle = ["sell_holdings", "sell_fee", "buy_usd", "buy_fee"];
    toggle.forEach(function(item) {
        let input = retrieveElement(item).element;
        if (input.hasAttribute("readonly")) {
            input.readOnly = false;
        } else {
            input.readOnly = true;
        }
    });
}
//*************************//
// retrieve element from pageVariable.inputForm
function retrieveElement(elementName) {
    let element = pageVariables.inputForm.filter(function(array) {
        if (array.name == elementName) {
            return array;
        }
    });
    return element[0];
}
//*************************//
// check to see if button is exchangeActive or not, return true if exchangeActive
function setCurrentInputFields() {
    x = (!pageVariables.exchangeActive()) ? Object.values(pageVariables.dollarBuyTop) : Object.values(pageVariables.dollarSellTop);
    pushValuesOut(x, pageVariables.currentInputFields);
}
//*************************//
// reset form on button toggle
function resetForm() {
    var input = ["sell_holdings", "sell_fee", "buy_usd", "buy_fee", "sell_rate", "buy_rate"];
    input.forEach(function(element) {
        document.getElementById(element).value = "";
    });
    form.run();
    switchProfitToCoin();
}
//*************************//
// Switch placeholder of earned
function switchProfitToCoin() {
    let earned = retrieveElement("earned").element;
    if (pageVariables.exchangeActive()) {
        earned.placeholder = "-";
    } else {
        earned.placeholder = "$";
    }
}
//*************************//
// get JSON from the website
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if ((status >= 200 && status < 300) ||
            status === 304) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send(null);
    xhr.addEventListener("load", reqListener);
}
getJSON("https://api.coinmarketcap.com/v1/ticker/?limit=10", coinCap);
//*************************//
// get JSON from coincap website
function coinCap(err, data) {
    if (err !== null) {
        log('Something went wrong: ' + err);
    } else {
        let a = data.entries();
        for (let e of a) {
            if (x = returnRequested(e[1])) {
                pageVariables.crypto = x;
            }
        }
    }
}
//*************************//
// functions to run when event is triggered
function reqListener() {
    addBitcoinPrice();
}
//*************************//
// add names of crypto that you want values for
function returnRequested(input) {
    let crypto = ["bitcoin"];
    if (checkValue(input.id, crypto)) {
        return input;
    }
}
//*************************//
// Add API value to html
function addBitcoinPrice() {
    let x = document.getElementsByClassName("navbar");
    let parentNode = x[0];
    let newNode = document.createElement("span");
    newNode.className = "navbar-text mr-auto";
    let node = document.createTextNode("1.00 BTC / $" + formatValue(pageVariables.crypto["price_usd"]));
    //newNode.innerHTML += '<i class="fa fa-btc" aria-hidden="true"></i>';
    newNode.appendChild(node);
    parentNode.appendChild(newNode);
    let dollarNode = parentNode.firstChild.nextSibling.nextSibling.nextSibling;
    let middleNode = newNode.previousSibling.previousSibling;
    parentNode.insertBefore(newNode, dollarNode);
}
//*************************//
// change form input type, act accordingly for text vs number
function changeInputFormType() {
    pageVariables.inputForm.forEach(function(layer) {
        if (pageVariables.userInputFields.includes(layer.name)) {
            layer.element.setAttribute("type", "number");
        } else {
            layer.element.setAttribute("type", "text");
        }
    });
}
//*************************//
// insert fancy symbols before input fields
// requires pageVariables.userInputsFields
function inputGroupAddOn(input='') {
    let x = pageVariables.userInputFields;
    (input=='') ? null : x = input; // added this new
    let elements = [];
    let a = [];
    for (i = 0; i < x.length; i++) {
        a[i] = retrieveElement(x[i]);
        elements.push(a[i].element);
    }
    pageVariables.userInputElements = elements;
    let y = [];
    let newNode = [];
    let newNodeChild = [];
    let previousNode = [];
    for (i = 0; i < x.length; i++) {
        y[i] = elements[i];
        newNode[i] = document.createElement("div");
        newNode[i].className = "input-group";
        newNodeChild[i] = document.createElement("span");
        newNodeChild[i].className = "input-group-addon";
        newNode[i].appendChild(newNodeChild[i]);
        newNodeChild[i].innerHTML = y[i].placeholder;
        y[i].placeholder = "";
        if (pageVariables.exchangeActive() != null) {
            previousNode[i] = y[i].previousSibling;
        } else {
            previousNode[i] = y[i].previousSibling.previousSibling;
        }
        newNode[i].appendChild(y[i]);
        insertAfter(newNode[i], previousNode[i]);
    }
    // insert node after refrence node
    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }
}
function resetInputGroupAddon() {
    elements = pageVariables.userInputElements;
    let sibling = [];
    let parent = [];
    for (i = 0; i < elements.length; i++) {
        sibling[i] = elements[i].previousSibling;
        parent[i] = elements[i].parentNode;
        elements[i].placeholder = sibling[i].innerHTML;
        sibling[i].innerHTML = "";
        unwrapElement(sibling[i], parent[i]);
        unwrapElement(parent[i], parent[i].parentNode);
    }
    function unwrapElement(element, parent) {
        while (element.firstChild) parent.insertBefore(element.firstChild, element);
        parent.removeChild(element);
    }
}
//*************************//
// pushes array values to another variable 
function pushValuesOut(input = [], variable = '') {
   // log(input);
    variable = (variable) ? variable : pageVariables.inputForm;
    if (Array.isArray(input)) {
        for (i = 0; i < input.length; i++) {
            variable.push(input[i]);
        }
    } else {
        variable.push(input);
    }
}

// add click to copy on the inputs we want
function inputCopy() {
    var
    x = retrieveElement("buy_received").element;        
    // if buy card is on top
    if(pageVariables.userInputFields[0] == "buy_usd") {
        x.setAttribute("data-copytarget", x.name);
        clipboardCopy();
    } else {
        if(x.getAttribute("data-copytarget")) {
            x.removeAttribute("data-copytarget");
        }
    }
}
//log(document.querySelector("buy_received"));
// add Bootstrap GroupAddOn to all inputs for easy reading
function addGroupAddOnAll() {
    // thoughts are to make an array of input names and use code used for userInputFields groupAddOn
    x = document.getElementsByTagName("input");
    y = [];
    for (i=0;i<x.length;i++) {
         y.push(x[i].name);
    }
    inputGroupAddOn(y);
    //log(y);
    //log(pageVariables.userInputFields);

}
//addGroupAddOnAll();
// write function for when sell is on top or button is clicked and buy_final_received is calculated add another input under - 1 
// profit card for the usd worth based on orignial sell off calculation. Kinda a cool feature. - 1 