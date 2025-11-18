import React, { useState, useEffect, useRef } from 'react';
import OrderBook from './components/OrderBook';
import MarketTrade from './components/MarketTrade';
import { formatPrice, formatAmount, formatTotal } from './utils/formatters';
import { DEPTH_OPTIONS } from './constants';

const App = () => {
  const [activeTab, setActiveTab] = useState('orderbook');
  const [symbol, setSymbol] = useState('btcusdt');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [lastPrice, setLastPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const [depth, setDepth] = useState(20);
  const [marketTrades, setMarketTrades] = useState([]);
  const wsRef = useRef(null);
  const wsTradeRef = useRef(null);
  const prevPriceRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      // Close existing connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Connect to Binance WebSocket for depth updates
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Update order book
        setOrderBook({
          bids: data.bids.slice(0, depth).map(([price, amount]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
            total: parseFloat(price) * parseFloat(amount)
          })),
          asks: data.asks.slice(0, depth).map(([price, amount]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
            total: parseFloat(price) * parseFloat(amount)
          }))
        });

        // Update last price (using best bid as reference)
        if (data.bids.length > 0) {
          const currentPrice = parseFloat(data.bids[0][0]);
          if (prevPriceRef.current !== null) {
            setPriceChange(currentPrice - prevPriceRef.current);
          }
          prevPriceRef.current = currentPrice;
          setLastPrice(currentPrice);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, depth]);

  // WebSocket for Market Trades
  useEffect(() => {
    const connectTradeWebSocket = () => {
      // Close existing connection
      if (wsTradeRef.current) {
        wsTradeRef.current.close();
      }

      // Connect to Binance WebSocket for trade updates
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        const trade = {
          id: data.t,
          price: parseFloat(data.p),
          quantity: parseFloat(data.q),
          time: new Date(data.T).toLocaleTimeString(),
          isBuyerMaker: data.m
        };

        setMarketTrades(prevTrades => {
          const newTrades = [trade, ...prevTrades];
          return newTrades.slice(0, 50); // Keep only last 50 trades
        });
      };

      ws.onerror = (error) => {
        console.error('Trade WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Trade WebSocket closed, reconnecting...');
        setTimeout(connectTradeWebSocket, 3000);
      };

      wsTradeRef.current = ws;
    };

    connectTradeWebSocket();

    return () => {
      if (wsTradeRef.current) {
        wsTradeRef.current.close();
      }
    };
  }, [symbol]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Trading Dashboard</h1>
          <div className="flex gap-4 items-center">
            <select
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              {DEPTH_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Symbol (e.g., btcusdt)"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 uppercase"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'orderbook'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab('markettrade')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'markettrade'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Market Trade
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orderbook' && (
          <OrderBook 
            orderBook={orderBook}
            lastPrice={lastPrice}
            priceChange={priceChange}
            formatPrice={formatPrice}
            formatAmount={formatAmount}
            formatTotal={formatTotal}
          />
        )}

        {activeTab === 'markettrade' && (
          <MarketTrade 
            symbol={symbol}
            trades={marketTrades}
            formatPrice={formatPrice}
            formatAmount={formatAmount}
          />
        )}
      </div>
    </div>
  );
};

export default App;