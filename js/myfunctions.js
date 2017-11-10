<<<<<<< HEAD
=======
// my functions	
	
	// doest string contain numbers
>>>>>>> Major edits
	function hasNumbers(string){
		var reg = /\d/;
		var results = reg.test(string);
		return results;	
	}
	// format input to right notation	
	function formatValue(value, format='0,000.00') {
			var number = numeral(value).format(format);
			//var value = number.value();
			return number;
	}
	// print to log, shorten function
	function log(log) {
		return console.log(log);	
	}
	// is the input a valid entry
	function validInput(value) {
		return (value >= 0) ? true : false;
	}
	// function for getting value on form inputs
	function v(value,setValue='0',newValue='') {
		let x = document.getElementById(value).value;
		if( validInput(x) && !isEmpty(x) )  {
			return fixInput(x);	
		}	
		return '';
	}
	// fix numbering back
	function fixInput(input) {
		return formatValue(input,'0.00[0000]');
	}
	// check if value is empty
	function isEmpty(value) {
		if( value == '' ) {
			return 1;
		} else { return 0; }
	}
	// round to the nearest 4th decimal	
	function roundUP(number) {
		return Math.round10(number, -4);
	}
	// format values
	function moneyFormat(price, sign = '$') {
		if(Number.isInteger(price)){
			const pieces = parseFloat(price).toFixed(2).split('')
			let ii = pieces.length - 3
			while ((ii-=3) > 0) {
				pieces.splice(ii, 0, ',')
			}
		return sign + pieces.join('')
		}
	}
	// convert integer to string
	function stringToInteger(input){
		let number = parseFloat(input);
		if(typeof number == "number") {
			return number;
		}
	}
	// get bootstrap size
	function getBootstrapDeviceSize() {
		return $('#users-device-size').find('div:visible').first().attr('id');
	}
	// check window size
	function smallWindowSize(){
		//log(window.outerWidth);	// <= 991px
		if(window.outerWidth <= 991){
			return true;
		}
		return false;
	}
	// see if array contains value
	function checkValue(value,arr){
	  var status = 0;
	  for(var i=0; i<arr.length; i++){
		   var name = arr[i];
		   if(name == value){
		      status = 1;
		      break;
		    }
	   }
	  return status;
 	}