const stocks = [
  { name: "Reliance", price: 2450 },
  { name: "TCS", price: 3800 },
  { name: "Infosys", price: 1500 },
];

function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Trading Simulator 📈
      </h1>

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

            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;