import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import OrderTooltip from './OrderTooltip';

const OrderBook = ({ orderBook, lastPrice, priceChange, formatPrice, formatAmount, formatTotal }) => {
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const calculateCumulativeData = (orders, upToIndex) => {
    const slicedOrders = orders.slice(0, upToIndex + 1);
    const sumBTC = slicedOrders.reduce((acc, order) => acc + order.amount, 0);
    const sumUSDT = slicedOrders.reduce((acc, order) => acc + order.total, 0);
    const avgPrice = sumUSDT / sumBTC;
    
    return {
      avgPrice: avgPrice || 0,
      sumBTC,
      sumUSDT
    };
  };

  const handleMouseEnter = (order, idx, type, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const orders = type === 'ask' ? [...orderBook.asks].reverse() : orderBook.bids;
    const cumulativeData = calculateCumulativeData(orders, idx);
    
    setHoveredOrder({
      ...order,
      ...cumulativeData,
      type
    });
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredOrder(null);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-900 text-gray-400 text-sm">
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) - Red */}
        <div className="max-h-96 overflow-y-auto">
          {[...orderBook.asks].reverse().map((order, idx) => (
            <div
              key={`ask-${idx}`}
              className="grid grid-cols-3 gap-4 px-4 py-1.5 hover:bg-gray-700 transition-colors relative cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(order, idx, 'ask', e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-red-500 font-mono text-sm">
                {formatPrice(order.price)}
              </div>
              <div className="text-right text-gray-300 font-mono text-sm">
                {formatAmount(order.amount)}
              </div>
              <div className="text-right text-gray-400 font-mono text-sm">
                {formatTotal(order.total)}
              </div>
              <div
                className="absolute right-0 top-0 h-full bg-red-900 opacity-10"
                style={{
                  width: `${Math.min(100, (order.total / Math.max(...orderBook.asks.map(a => a.total))) * 100)}%`
                }}
              />
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="bg-gray-900 px-4 py-4 border-t border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {lastPrice ? formatPrice(lastPrice) : '—'}
              </span>
              {priceChange !== 0 && (
                <span className="flex items-center gap-1">
                  {priceChange > 0 ? (
                    <ArrowUp size={16} className="text-green-500" />
                  ) : (
                    <ArrowDown size={16} className="text-red-500" />
                  )}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400">
              ${lastPrice ? formatPrice(lastPrice) : '—'}
            </div>
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="max-h-96 overflow-y-auto">
          {orderBook.bids.map((order, idx) => (
            <div
              key={`bid-${idx}`}
              className="grid grid-cols-3 gap-4 px-4 py-1.5 hover:bg-gray-700 transition-colors relative cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(order, idx, 'bid', e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-green-500 font-mono text-sm">
                {formatPrice(order.price)}
              </div>
              <div className="text-right text-gray-300 font-mono text-sm">
                {formatAmount(order.amount)}
              </div>
              <div className="text-right text-gray-400 font-mono text-sm">
                {formatTotal(order.total)}
              </div>
              <div
                className="absolute right-0 top-0 h-full bg-green-900 opacity-10"
                style={{
                  width: `${Math.min(100, (order.total / Math.max(...orderBook.bids.map(b => b.total))) * 100)}%`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <OrderTooltip 
        hoveredOrder={hoveredOrder}
        tooltipPosition={tooltipPosition}
        formatPrice={formatPrice}
      />
    </>
  );
};

export default OrderBook;
