//*******// Author: Emre

	//*************************//
	// set pageVariables
	var pageVariables;
	function setPageVariables() {
		pageVariables = { 
			window: null, 
			removed: null, 
			profit: document.getElementsByClassName('order-2')[0],
			buy: document.getElementsByClassName('order-1')[0],
			sell: document.getElementsByClassName('order-3')[0],
			button:	document.getElementsByTagName('button')[0],
			active: null
		 };
	}	
	setPageVariables();
	//*************************//
	// Object with form functions
	function inputValues() {
		this.run = function() {
			formFunctions();	
		};		
	}	
    form = new inputValues();
    form.run();
    //*************************************************************************//
	//*************************//       EVENTS	
	
	//*************************//
	 // When input is entered   
    function onChange() {
	     form.run();
	     //log(pageVariables.inputs);
    }
	//*************************//
	// add button to pagevariables
	pageVariables.button.onclick = function(){
		buttonEvent();
	};    
	//*************************//
	// functions triggered when event occurs
	function buttonEvent() {
		checkButton();
		switchBuySell();
		switchReadOnly();
		resetForm();
		
	}
	//*************************//
	// Changes arrangement of boxes for different screen sizes
	document.body.onresize = function(){
		changeBootstrapOrdering()
	};	
	changeBootstrapOrdering();
    //*************************************************************************//
	//*************************//
	// fire up each function in order to make the app work
	function formFunctions() {
		// state of button value
		log("State of Button: "+pageVariables.active);
				
		// Buy cardOne Sell cardTwo
		// Sell CardOne Sell cardTwo
			
		var cardOneValues = setcardOneValues();
		// buy_usd, buy_rate, buy_fee
		// sell_holdings, sell_rate, sell_fee
			
		var cardTwoValues = setcardTwoValues(); 
		// sell_rate
		// buy_rate
		
		var calculated_card_one = calculate_card_one(cardOneValues); 
		// buy_fee_dollar, buy_received, buy_final_received
		// sell_fee_dollar, sell_usd, sell_final_received

		
		var calculated_card_two = calculate_card_two(cardOneValues, cardTwoValues, calculated_card_one); 
		// sell_holdings, sell_usd, sell_fee, sell_fee_dollar, sell_final_usd 
		// buy_usd, buy_received, buy_fee, buy_fee_dollar, buy_final_received
		
		var calculated_profits = calculate_profit(cardOneValues, cardTwoValues, calculated_card_one, calculated_card_two); 
		// earned, earned_percentage, total_fee 
		
		var formVariables = [ cardOneValues, cardTwoValues, calculated_card_one, calculated_card_two, calculated_profits ];
		
		convertToFormValue(formVariables);
		// convert the data to form object properties
		
		insertValues();
		// add values to the html elements
		
		cardColor();
		// changes color of card depending on profit or loss
		
		checkInputValue();	
		// if buy_fee is empty or 0 the forms fee elements change accordingly 
		
		addElementPropertyToForm();
		// add element selector to pageVariables.input
			
	}	
	//*************************//
	// snatch Card One inputs
	function setcardOneValues() {
	   var inputVariables = [];
	   if( !pageVariables.active ) {
		   var inputIdList = ["buy_usd", "buy_rate", "buy_fee"];		
	
		   inputIdList.forEach(function(element) {
			   let elementValue = v(element);
			   let myArray = { name: element, value: (!isEmpty(elementValue)) ? stringToInteger(elementValue): 0, isEmpty: isEmpty(elementValue) };
			   inputVariables.push(myArray);
		   });
		   return inputVariables;	   
		} else {
			var inputIdList = ["sell_holdings", "sell_rate", "sell_fee"];
			
			inputIdList.forEach(function(element) {
			   let elementValue = v(element);
			   let myArray = { name: element, value: (!isEmpty(elementValue)) ? stringToInteger(elementValue): 0, isEmpty: isEmpty(elementValue) };
			   inputVariables.push(myArray);
		   });
		   return inputVariables;		
		}
	}
	//*************************//
	// snatch Card Two inputs
	function setcardTwoValues() {
		if( !pageVariables.active ) {
		    let inputIdList = ["sell_rate"];
		    let elementValue = v(inputIdList[0]);
			return { name: inputIdList[0], value: (!isEmpty(elementValue)) ? stringToInteger(elementValue) : 0, isEmpty: isEmpty(elementValue) };
		} else {
			let inputIdList = ["buy_rate"];
		    let elementValue = v(inputIdList[0]);
			return { name: inputIdList[0], value: (!isEmpty(elementValue)) ? stringToInteger(elementValue) : 0, isEmpty: isEmpty(elementValue) };
		}
	}
	//*************************//
	// calculate the buy readonly fields
	function calculate_card_one(input) {
		if( !pageVariables.active ) {
			// if buy_fee exists
			// buy_fee_dollar = buy_usd * buy_fee 
			if(input[2]["isEmpty"] == 0) { 
				var buy_fee_dollar = { name: "buy_fee_dollar", value: input[0]["value"] * input[2]["value"], isEmpty: 0 }; 
	     	} else {
		     	var buy_fee_dollar = { name: "buy_fee_dollar", value: 0, isEmpty: 1 };
	     	}
	     	// if buy_usd and buy_rate exist
	     	// buy_received = buy_usd * buy_rate
	     	if(input[0]["isEmpty"] == 0 && input[1]["isEmpty"] == 0) {
	     		var buy_received = { name: "buy_received", value: input[0]["value"] / input[1]["value"], isEmpty: 0 }; 
	     	} else {
		     	var buy_received = { name: "buy_received", value: 0, isEmpty: 1 };
	     	}
			// if buy_received & buy_fee_dollar exist
			// buy_final_received = (buy_usd - buy_fee_dollar) / buy_rate
			if(buy_received["isEmpty"] == 0 && buy_fee_dollar["isEmpty"] == 0) {
				var buy_final_received = { name: "buy_final_received", value: (input[0]["value"] - buy_fee_dollar["value"]) / input[1]["value"], isEmpty: 0 };
			} else { 
				var buy_final_received = { name: "buy_final_received", value: 0, isEmpty: 1 };
			}
			// create array of variables
			var calculated_card_one = [ buy_fee_dollar, buy_received, buy_final_received ];
			return 	calculated_card_one;
		} else { // ELSE*****
// if sell_holdings and sell_rate exist
		     	// sell_usd = sell_holdings * sell_rate
		     	if(input[0]["isEmpty"] == 0 && input[1]["isEmpty"] == 0) {
		     		var sell_usd = { name: "sell_usd", value: input[0]["value"] * input[1]["value"], isEmpty: 0 }; 
		     	} else {
			     	var sell_usd = { name: "sell_usd", value: 0, isEmpty: 1 };
		     	}
				// if sell_fee exists
				// sell_fee_dollar = sell_usd * sell_fee 	
				if(input[2]["isEmpty"] == 0) { 
					var sell_fee_dollar = { name: "sell_fee_dollar", value: sell_usd["value"] * input[2]["value"], isEmpty: 0 }; 
		     	} else {
			     	var sell_fee_dollar = { name: "sell_fee_dollar", value: 0, isEmpty: 1 };
		     	}
		     	// if sell_usd & sell_fee_dollar exist
				// sell_final_received = (sell_usd - buy_fee_dollar) / sell_rate
				if(sell_usd["isEmpty"] == 0 && sell_fee_dollar["isEmpty"] == 0) {
					var sell_final_usd = { name: "sell_final_usd", value: (sell_usd["value"] - sell_fee_dollar["value"]), isEmpty: 0 };
				} else {
					var sell_final_usd = { name: "sell_final_usd", value: 0, isEmpty: 1 };
				}
				// create array of variables
				var calculated_card_one = [ sell_fee_dollar, sell_usd, sell_final_usd ];
				return 	calculated_card_one;			
			}
     }

	//*************************//
	// calculate the sell readonly fields
	function calculate_card_two(one, two, calculated_card_one) {
		if( !pageVariables.active ) {	
			// if buy_final_received exists
			// sell_holdings = buy_final_received
			if(calculated_card_one[2]["isEmpty"] == 0){
				var sell_holdings = { name: "sell_holdings", value: calculated_card_one[2]["value"], isEmpty: 0 };
			} else {
				var sell_holdings = { name: "sell_holdings", value: 0, isEmpty: 1 };
			}
			//	if sell_holdings & sell_rate exists
			// sell_usd = sell_holdings * sell_rate
			if(sell_holdings["isEmpty"] == 0 && two["isEmpty"] == 0) {
				// sell_usd = sell_holdings * sell_rate
				var sell_usd = { name: "sell_usd", value: sell_holdings["value"] * two["value"], isEmpty: 0 };
			} else {
				var sell_usd = { name: "sell_usd", value: 0, isEmpty: 1 };
			}
			// if buy_fee exists
			// sell_fee = buy_fee
			if(one[2]["isEmpty"] == 0){
				// sell_fee = buy_fee
				var sell_fee = { name: "sell_fee", value: one[2]["value"], isEmpty: 0 };
			} else {
				var sell_fee = { name: "sell_fee", value: 0, isEmpty: 1 };
			}
			// if sell_usd & sell_fee exists
			// sell_fee_dollar = sell_usd * sell_fee
			if(sell_usd["isEmpty"] == 0 && sell_fee["isEmpty"] == 0) {
				var sell_fee_dollar = { name: "sell_fee_dollar", value: sell_usd["value"] * sell_fee["value"], isEmpty: 0 }; 
			} else {
				var sell_fee_dollar = { name: "sell_fee_dollar", value: 0, isEmpty: 1 }; 
			}
			// if sell_fee_dollar exists
			// sell_final_usd = sell_usd - sell_fee_dollar
			if(sell_fee_dollar["isEmpty"] == 0) {
				var sell_final_usd = { name: "sell_final_usd", value: sell_usd["value"] - sell_fee_dollar["value"], isEmpty: 0 };
			} else {
				var sell_final_usd = { name: "sell_final_usd", value: 0, isEmpty: 1 };
			}
			// create array of variables
			var calculated_card_two = [sell_holdings, sell_usd, sell_fee, sell_fee_dollar, sell_final_usd];
			return calculated_card_two;
		} else { // ELSE*****
			// if sell_final_usd exists
			// buy_usd = sell_final_usd
			if(calculated_card_one[2]["isEmpty"] == 0){
				var buy_usd = { name: "buy_usd", value: calculated_card_one[2]["value"], isEmpty: 0 };
			} else {
				var buy_usd = { name: "buy_usd", value: 0, isEmpty: 1 };
			}
			//	if buy_usd & buy_rate exists
			// buy_received = buy_usd * buy_rate
			if(buy_usd["isEmpty"] == 0 && two["isEmpty"] == 0) {
				// sell_usd = sell_holdings * sell_rate
				var buy_received = { name: "buy_received", value: buy_usd["value"] / two["value"], isEmpty: 0 };
			} else {
				var buy_received = { name: "buy_received", value: 0, isEmpty: 1 };
			}
			// if sell_fee exists
			// buy_fee = sell_fee
			if(one[2]["isEmpty"] == 0){
				// sell_fee = buy_fee
				var buy_fee = { name: "buy_fee", value: one[2]["value"], isEmpty: 0 };
			} else {
				var buy_fee = { name: "buy_fee", value: 0, isEmpty: 1 };
			}
			// if buy_usd & buy_fee exists
			// buy_fee_dollar = buy_usd * buy_fee
			if(buy_usd["isEmpty"] == 0 && buy_fee["isEmpty"] == 0) {
				var buy_fee_dollar = { name: "buy_fee_dollar", value: buy_usd["value"] * buy_fee["value"], isEmpty: 0 }; 
			} else {
				var buy_fee_dollar = { name: "buy_fee_dollar", value: 0, isEmpty: 1 }; 
			}
			// if sell_fee_dollar exists
			// buy_final_received = buy_usd - buy_fee_dollar
			if(buy_received["isEmpty"] == 0) {
				var buy_final_received = { name: "buy_final_received", value: (buy_usd["value"] - buy_fee_dollar["value"] ) / two["value"], isEmpty: 0 };
			} else {
				var buy_final_received = { name: "buy_final_received", value: 0, isEmpty: 1 };
			}
			// create array of variables
			var calculated_card_two = [buy_usd, buy_received, buy_fee, buy_fee_dollar, buy_final_received];
			return calculated_card_two;		
			}
    }

	//*************************//
	// calculate the profit readonly fields
	function calculate_profit(one, two, calculated_card_one, calculated_card_two) {
		if( !pageVariables.active ) {
		 	// if sell_final_usd exists
			if(calculated_card_two[4]["isEmpty"] == 0) {
				// earned = sell_final_usd - buy_usd
				var earned =  { name: "earned", value: calculated_card_two[4]["value"] - one[0]["value"], isEmpty: 0 };
				// earned_percentage = (sell_final_usd / buy_usd) - 1
				var earned_percentage = { name: "earned_percentage", value: (calculated_card_two[4]["value"] / one[0]["value"]) - 1, isEmpty: 0 };
				// total_fee = buy_fee_dollar + sell_fee_dollar
				var total_fee =  { name: "total_fee", value: calculated_card_one[0]["value"] + calculated_card_two[3]["value"], isEmpty: 0 };
			} else {
				var earned = { name: "earned", value: 0, isEmpty: 1 };
				var earned_percentage = { name: "earned_percentage", value: 0, isEmpty: 1 };
				var total_fee  = { name: "total_fee", value: 0 ,isEmpty: 1 };
			}
		}   else { // ELSE*****
		 	// if buy_final_received exists
			if(calculated_card_two[4]["isEmpty"] == 0) {
				// earned = buy_final_received - sell_holdings
				var earned =  { name: "earned", value: calculated_card_two[4]["value"] - one[0]["value"], isEmpty: 0 };
				// earned_percentage = (buy_final_received / sell_holdings) - 1
				var earned_percentage = { name: "earned_percentage", value: (calculated_card_two[4]["value"] / one[0]["value"]) - 1, isEmpty: 0 };
				// total_fee = buy_fee_dollar + sell_fee_dollar
				var total_fee =  { name: "total_fee", value: calculated_card_one[0]["value"] + calculated_card_two[3]["value"], isEmpty: 0 };
			} else {
				var earned = { name: "earned", value: 0, isEmpty: 1 };
				var earned_percentage = { name: "earned_percentage", value: 0, isEmpty: 1 };
				var total_fee  = { name: "total_fee", value: 0 ,isEmpty: 1 };
			}		
		}	
		// create array of variables
		var calculated_profits = [earned, earned_percentage, total_fee];
		return calculated_profits;
	}
	//*************************//
	// change multi-dimensional array to single level array
	function organizeArray(input) {
	// convert all array objects to same level
		let myArray = [];
		input.forEach(function(element) {
			if(Array.isArray(element)) {
				element.forEach(function(element2) {
					myArray.push(element2);
				})
			} else {
				myArray.push(element);
			}
		});
		return myArray;
	}
	//*************************//
	// snatch needed values from object array 
	function convertToFormValue(input) {
		pageVariables.inputs = organizeArray(input);
		pageVariables.inputs.forEach(function(element) {
			form[element["name"]] = element["value"];
		})	
	}
	//*************************//
	// format the form values to nicely formatted numbers
	function formatOutput(name, value, skip=0) {
	// edit output by formatting values	
		if(value || skip == 1){
			let dollarFormat = ["buy_fee_dollar", "sell_usd", "sell_fee_dollar", "sell_final_usd", "total_fee", (!pageVariables.active) ? "earned" : "buy_usd"];
			let percentageFormat = [ (!pageVariables.active) ? "sell_fee" : "buy_fee", "earned_percentage"];
			let coinFormat = ["buy_received", "buy_final_received", "sell_holdings", (!pageVariables.active) ? null : "earned"];
			
			if(dollarFormat.includes(name)) {
				return formatValue(value, '$0,0.00');
			}
			if(percentageFormat.includes(name)) {
				return formatValue(value, '0.00[0]%');
			}
			if(coinFormat.includes(name)) {
				return formatValue(value, '0.[00000]')
			}
			return value;
		}	
		return '';
	}
	//*************************//
	// write the values onto the html
	function insertValues() {
		for (var prop in form) {
			if(form[prop] != form["run"]){
			//log(`${prop} = ${form[prop]}`);
			if( !pageVariables.active ) {
				var exclude = ["buy_usd", "buy_rate", "buy_fee", "sell_rate"];
			} else {
				var exclude = ["sell_holdings", "sell_rate", "sell_fee", "buy_rate"];

			}
			(form[prop] == 0) ? form[prop] = "" : form[prop];
				if( !exclude.includes(prop) ) {  
					document.getElementById(`${prop}`).value  = formatOutput(prop, form[prop]);
					//log(`${prop} = ${form[prop]}`);
				}
			}
		}
		//log("*******end******");
	}
	//*************************//
	// change the order of buy card or sell card depending on the screen size
	function changeBootstrapOrdering() {

		if( smallWindowSize() ) {
			let a = pageVariables.profit;
			if(pageVariables.removed != 'yes') {
				a.classList.remove('order-2');
				a.classList.add('order-4');
				pageVariables.removed = 'yes';
			}
			pageVariables.window = 'small';	
		} else {
			let a = pageVariables.profit;
			if(pageVariables.removed == 'yes') {
			a.classList.remove('order-4');	
			a.classList.add('order-2');
			pageVariables.removed = 'no';
			}
			pageVariables.window = 'large';
		}
	}
	//*************************//
	// change the color of the profit card depending on the money earned or "earned" input
	function cardColor() {
		let a = document.getElementById('profit');
		switch (true) {
			case (form.earned > 0):
				a.classList.remove("card-alert", "card-default");
				a.classList.add("card-success");
				break;
			case (form.earned < 0):
				a.classList.remove("card-success", "card-default");
				a.classList.add("card-alert");
				break;
			case (form.earned == 0):
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
  	function changeFee(reset=0) {
  			let varFee = ["buy_fee_dollar", (!pageVariables.active) ? "sell_fee" : "buy_fee", "sell_fee_dollar", "total_fee"];
  			if(reset == 0 ){
	  			varFee.forEach(function(element) {
	  				document.getElementById(element).value  = formatOutput(element, 0, 1);
	  			}); 
  			} else if (reset == 1 ) {
	  			varFee.forEach(function(element) {
	  				document.getElementById(element).value  = formatOutput(element, 0);
	  			}); 
  			}	
  			return false;	
  	}
	//*************************//
  	// if buy_fee is empty or 0 the forms fee elements change accordingly 
  	// or if the buy and sell events are neutral than the profits inputs are 0s
  	function checkInputValue() {	
			if( document.getElementById("buy_fee").value == 0) {
				changeFee();
			}
			if( pageVariables.inputs[2].isEmpty == 1) {
				changeFee(reset=1);
			}
			if( !document.getElementById("earned").value && !document.getElementById("earned_percentage").value && (retrieveElement("buy_final_received").isEmpty == 0 && retrieveElement("sell_final_usd").isEmpty == 0) ) {
				
				if( !pageVariables.active ) {
					document.getElementById("earned").value  = formatOutput("earned", 0, 1);
					document.getElementById("earned_percentage").value  = formatOutput("earned_percentage", 0, 1);
				} else {
	  				document.getElementById("earned").value  = formatOutput("earned", 0);
	  				document.getElementById("earned_percentage").value  = formatOutput("earned_percentage", 0);
				}
				log("im in");
			}
  	}
	//*************************//
  	function addElementPropertyToForm() {
	  	let elements = [];
	  	pageVariables.inputs.forEach(function(element){
		  	elements.push(element.name);
	  	});
	  		  			  	
	    for (i = 0; i < pageVariables.inputs.length; i++) { 
		    	let x = retrieveElement(elements[i]);
		    	x.element = document.getElementById(elements[i]);
		    	pageVariables.inputs.shift();
		    	pageVariables.inputs.push(x);
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
	  	
	  	toggle.forEach(function(item){
		  	let input = retrieveElement(item).element;
		  		if(input.hasAttribute("readonly")){
			  		input.readOnly = false;
		  		} else {
			  		input.readOnly = true;
		  		}
	  	});
  	}
	//*************************//
  	// pageVariable.inputs needs to exist
  	function retrieveElement(elementName) {
	  	let element = pageVariables.inputs.filter(function(array){
			  	if( array.name == elementName ) {
				  	return array;
		  		}
	  	});
	  	return element[0];
  	}
  	//*************************//
  	// check to see if button is active or not, return true if active
  	function checkButton() {
	  	if( pageVariables.active ) {
		  	pageVariables.active = false;
	  	} else { 
	  	pageVariables.active = true;  
	  	}
	  	return pageVariables.active;
  	}
  	//*************************//
  	// reset form on button toggle
  	function resetForm() {
	  	var input = ["sell_holdings", "sell_fee", "buy_usd", "buy_fee", "sell_rate", "buy_rate"];
	  	input.forEach(function(element){
		  document.getElementById(element).value = "";	
	  	});
	  	switchProfitToCoin();
	  	form.run();
  	}
  	//*************************//
  	// Switch placeholder of earned
  	function switchProfitToCoin() {
	  	let earned = retrieveElement("earned").element;
	  	earned.placeholder = "-";
  	}

  	
