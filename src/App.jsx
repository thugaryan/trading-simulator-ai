import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch Reliance stock price periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "[alphavantage.co](https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.BSE&apikey=8ZQ8PNY3XFVNN18J)"
        );
        const data = await res.json();
        const price = Number(data["Global Quote"]?.["05. price"]) || 2450;

        const updatedStocks = [
          { name: "Reliance", price },
          { name: "TCS", price: 3800 },
          { name: "Infosys", price: 1500 },
        ];

        setStocks(updatedStocks);
      } catch (err) {
        console.error("Stock fetch failed", err);
        // fallback
        setStocks([
          { name: "Reliance", price: 2450 },
          { name: "TCS", price: 3800 },
          { name: "Infosys", price: 1500 },
        ]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update chart whenever stock data changes
  useEffect(() => {
    if (stocks.length > 0) {
      setChartData({
        labels: stocks.map((s) => s.name),
        datasets: [
          {
            label: "Stock Prices",
            data: stocks.map((s) => Number(s.price)),
            borderWidth: 2,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      });
    }
  }, [stocks]);

  // Buy handler
  const handleBuy = (stock) => {
    if (balance < stock.price) {
      alert("Not enough balance!");
      return;
    }

    setBalance(balance - stock.price);

    const existing = portfolio.find((item) => item.name === stock.name);
    if (existing) {
      setPortfolio(
        portfolio.map((item) =>
          item.name === stock.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setPortfolio([...portfolio, { ...stock, quantity: 1 }]);
    }
  };

  // Sell handler
  const handleSell = (stock) => {
    const existing = portfolio.find((item) => item.name === stock.name);
    if (!existing) return;

    setBalance(balance + stock.price);

    if (existing.quantity === 1) {
      setPortfolio(portfolio.filter((item) => item.name !== stock.name));
    } else {
      setPortfolio(
        portfolio.map((item) =>
          item.name === stock.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const totalInvestment = portfolio.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const getInsight = (price) => {
    if (price > 3000) return "High value stock 📈";
    if (price > 2000) return "Stable stock 👍";
    return "Budget friendly 💡";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Trading Simulator 📊</h1>
      <h2 className="mb-4 text-lg">Balance: ₹{balance}</h2>

      {chartData.labels.length > 0 && (
        <Line data={chartData} options={{ responsive: true }} />
      )}

      <h3 className="mb-4 mt-4">Total Invested: ₹{totalInvestment}</h3>

      <div className="grid gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.name}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{stock.name}</h2>
              <p>{getInsight(stock.price)}</p>
              <p>₹{stock.price}</p>
            </div>

            <button
              onClick={() => handleBuy(stock)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
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
          portfolio.map((item) => (
            <div
              key={item.name}
              className="bg-white p-4 mb-2 rounded shadow flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                  ₹{item.price} × {item.quantity}
                </p>
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
