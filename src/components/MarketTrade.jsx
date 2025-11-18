import React from 'react';

const MarketTrade = ({ symbol, trades, formatPrice, formatAmount }) => {
  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-900 text-gray-400 text-sm">
          <div>Price (USDT)</div>
          <div className="text-right">Amount ({symbol.replace('usdt', '').toUpperCase()})</div>
          <div className="text-right">Time</div>
        </div>

        {/* Trades List */}
        <div className="max-h-[800px] overflow-y-auto">
          {trades.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Waiting for trade data...
            </div>
          ) : (
            trades.map((trade) => (
              <div
                key={trade.id}
                className="grid grid-cols-3 gap-4 px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <div className={`font-mono text-sm ${trade.isBuyerMaker ? 'text-red-500' : 'text-green-500'}`}>
                  {formatPrice(trade.price)}
                </div>
                <div className="text-right text-gray-300 font-mono text-sm">
                  {formatAmount(trade.quantity)}
                </div>
                <div className="text-right text-gray-400 text-sm">
                  {trade.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Buy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Sell</span>
          </div>
        </div>
        <div className="mt-2">
          Connected to Binance WebSocket • Real-time trades
        </div>
      </div>
    </>
  );
};

export default MarketTrade;
