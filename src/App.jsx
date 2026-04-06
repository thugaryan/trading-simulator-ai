import { useState } from "react";
const stocks = [
  { name: "Reliance", price: 2450 , quantity: 2},
  { name: "TCS", price: 3800 , quantity: 2},
  { name: "Infosys", price: 1500 , quantity: 2},
];

function App() {
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([]);

  const handleBuy = (stock) => {
  if (balance >= stock.price) {
    setBalance(balance - stock.price);

    const existingStock = portfolio.find(
      (item) => item.name === stock.name
    );

    if (existingStock) {
      const updatedPortfolio = portfolio.map((item) =>
        item.name === stock.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setPortfolio(updatedPortfolio);
    } else {
      setPortfolio([...portfolio, { ...stock, quantity: 1 }]);
    }

  } else {
    alert("Not enough balance!");
  }
};
const handleSell = (stock) => {
  const existingStock = portfolio.find(
    (item) => item.name === stock.name
  );

  if (!existingStock) return;

  setBalance(balance + stock.price);

  if (existingStock.quantity === 1) {
    setPortfolio(
      portfolio.filter((item) => item.name !== stock.name)
    );
  } else {
    const updatedPortfolio = portfolio.map((item) =>
      item.name === stock.name
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setPortfolio(updatedPortfolio);
  }
};
const totalInvestment = portfolio.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Trading Simulator 📈
      </h1>
      
      <h2 className="mb-4 text-lg">
          Balance: ₹{balance}
      </h2>
      <h3 className="mb-4">
       Total Invested: ₹{totalInvestment}
      </h3>
      <div className="grid gap-4">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{stock.name}</h2>
              <p>₹{stock.price}</p>
            </div>

            <button 
            onClick={() => handleBuy(stock)}
            className="bg-green-500 text-white px-4 py-2 rounded">
              Buy
            </button>
          </div>
        ))}
      </div>
     <h2 className="mt-8 text-xl font-bold">Your Portfolio</h2>

<div className="mt-4">
  {portfolio.length === 0 ? (
    <p>No stocks bought yet</p>
  ) : (
    portfolio.map((item, index) => (
      <div
        key={index}
        className="bg-white p-4 mb-2 rounded shadow flex justify-between"
      >
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p>₹{item.price} × {item.quantity}</p>
        </div>

        <button
          onClick={() => handleSell(item)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sell
        </button>
      </div>
    ))
  )}
</div>
    </div>
  );
}

export default App;