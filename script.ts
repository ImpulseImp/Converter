interface Rates {
  BYN: number;
  USD: number;
  EUR: number;
  CNY: number;
  RUB: number;
}

const rates: Rates = {
  BYN: 1,
  USD: 3.15,
  EUR: 3.43,
  CNY: 0.44,
  RUB: 0.036,
};

const historicalRates: { [date: string]: Rates } = generateHistoricalRates();

const currencyElement = document.getElementById(
  'currency'
) as HTMLSelectElement;
const amountElement = document.getElementById('amount') as HTMLInputElement;
const dateElement = document.getElementById('date') as HTMLInputElement;

currencyElement.addEventListener('change', convertCurrency);
amountElement.addEventListener('input', convertCurrency);
dateElement.addEventListener('change', convertCurrency);

const today: string = new Date().toISOString().split('T')[0];
dateElement.value = today;

let previousDate: string = today;

function convertCurrency(): void {
  const currency: string = currencyElement.value;
  const amount: number = parseFloat(amountElement.value);
  let date: string = dateElement.value;

  if (!date) {
    date = today;
  }

  if (new Date(date) > new Date()) {
    alert('Вы не можете выбрать дату в будущем.');
    dateElement.value = previousDate;
    return;
  }

  previousDate = date;

  const rate: number = getRateByDate(currency, date);
  const bynValue: number = amount * rate;

  (
    document.getElementById('bynLabel') as HTMLLabelElement
  ).textContent = `BYN: ${(bynValue / rates.BYN).toFixed(2)}`;
  (
    document.getElementById('usdLabel') as HTMLLabelElement
  ).textContent = `USD: ${(bynValue / rates.USD).toFixed(2)}`;
  (
    document.getElementById('eurLabel') as HTMLLabelElement
  ).textContent = `EUR: ${(bynValue / rates.EUR).toFixed(2)}`;
  (
    document.getElementById('cnyLabel') as HTMLLabelElement
  ).textContent = `CNY: ${(bynValue / rates.CNY).toFixed(2)}`;
  (
    document.getElementById('rubLabel') as HTMLLabelElement
  ).textContent = `RUB: ${(bynValue / rates.RUB).toFixed(2)}`;
}

function getRateByDate(currency: string, date: string): number {
  const today: string = new Date().toISOString().split('T')[0];
  if (!date || new Date(date) > new Date() || date === today) {
    return rates[currency];
  }
  const selectedDate: Date = new Date(date);
  const startDate: Date = new Date();
  startDate.setDate(startDate.getDate() - 14);

  if (selectedDate < startDate) {
    return historicalRates[startDate.toISOString().split('T')[0]][currency];
  } else {
    return historicalRates[date][currency];
  }
}

function generateHistoricalRates(): { [date: string]: Rates } {
  const history: { [date: string]: Rates } = {};
  const baseRates: Rates = { ...rates };
  const today: Date = new Date();

  for (let i = 0; i < 15; i++) {
    const date: Date = new Date();
    date.setDate(today.getDate() - i);
    const dateString: string = date.toISOString().split('T')[0];

    const dayRates: Rates = {} as Rates;
    for (const key in baseRates) {
      if (baseRates.hasOwnProperty(key)) {
        let randomFactor: number = 1;
        if (i !== 0) {
          randomFactor = 1 + (Math.random() - 0.5) / 5;
        }
        dayRates[key as keyof Rates] = parseFloat(
          (baseRates[key as keyof Rates] * randomFactor).toFixed(4)
        );
      }
    }
    history[dateString] = dayRates;
  }
  return history;
}

convertCurrency();
