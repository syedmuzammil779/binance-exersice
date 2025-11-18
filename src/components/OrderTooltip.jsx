import React from 'react';

const OrderTooltip = ({ hoveredOrder, tooltipPosition, formatPrice }) => {
  if (!hoveredOrder) return null;

  return (
    <div
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 pointer-events-none"
      style={{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y - 10}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="text-sm space-y-1">
        <div className="flex justify-between gap-8">
          <span className="text-gray-400">Avg.Price:</span>
          <span className="text-white font-mono">≈ {formatPrice(hoveredOrder.avgPrice)}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-gray-400">Sum BTC:</span>
          <span className="text-white font-mono">{hoveredOrder.sumBTC.toFixed(5)}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-gray-400">Sum USDT:</span>
          <span className="text-white font-mono">{formatPrice(hoveredOrder.sumUSDT)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTooltip;
