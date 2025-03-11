var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var rates = {
    BYN: 1,
    USD: 3.15,
    EUR: 3.43,
    CNY: 0.44,
    RUB: 0.036,
};
var historicalRates = generateHistoricalRates();
var currencyElement = document.getElementById('currency');
var amountElement = document.getElementById('amount');
var dateElement = document.getElementById('date');
currencyElement.addEventListener('change', convertCurrency);
amountElement.addEventListener('input', convertCurrency);
dateElement.addEventListener('change', convertCurrency);
var today = new Date().toISOString().split('T')[0];
dateElement.value = today;
var previousDate = today;
function convertCurrency() {
    var currency = currencyElement.value;
    var amount = parseFloat(amountElement.value);
    var date = dateElement.value;
    if (isNaN(amount) || amountElement.value.trim() === '') {
        amount = 0;
    }
    if (!date) {
        date = today;
    }
    if (new Date(date) > new Date()) {
        alert('Вы не можете выбрать дату в будущем.');
        dateElement.value = previousDate;
        return;
    }
    previousDate = date;
    var rate = getRateByDate(currency, date);
    var bynValue = amount * rate;
    document.getElementById('bynLabel').textContent = "BYN: ".concat((bynValue / rates.BYN).toFixed(2));
    document.getElementById('usdLabel').textContent = "USD: ".concat((bynValue / rates.USD).toFixed(2));
    document.getElementById('eurLabel').textContent = "EUR: ".concat((bynValue / rates.EUR).toFixed(2));
    document.getElementById('cnyLabel').textContent = "CNY: ".concat((bynValue / rates.CNY).toFixed(2));
    document.getElementById('rubLabel').textContent = "RUB: ".concat((bynValue / rates.RUB).toFixed(2));
}
function getRateByDate(currency, date) {
    var today = new Date().toISOString().split('T')[0];
    if (!date || new Date(date) > new Date() || date === today) {
        return rates[currency];
    }
    var selectedDate = new Date(date);
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    if (selectedDate < startDate) {
        return historicalRates[startDate.toISOString().split('T')[0]][currency];
    }
    else {
        return historicalRates[date][currency];
    }
}
function generateHistoricalRates() {
    var history = {};
    var baseRates = __assign({}, rates);
    var today = new Date();
    for (var i = 0; i < 15; i++) {
        var date = new Date();
        date.setDate(today.getDate() - i);
        var dateString = date.toISOString().split('T')[0];
        var dayRates = {};
        for (var key in baseRates) {
            if (baseRates.hasOwnProperty(key)) {
                var randomFactor = 1;
                if (i !== 0) {
                    randomFactor = 1 + (Math.random() - 0.5) / 5;
                }
                dayRates[key] = parseFloat((baseRates[key] * randomFactor).toFixed(4));
            }
        }
        history[dateString] = dayRates;
    }
    return history;
}
convertCurrency();
