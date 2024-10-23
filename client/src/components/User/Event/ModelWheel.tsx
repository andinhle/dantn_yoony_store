import React, { useState, useRef } from 'react';

// Mảng màu mặc định
const DEFAULT_COLORS = [
  '#FF6B6B', // đỏ cam
  '#4ECDC4', // xanh ngọc
  '#45B7D1', // xanh biển
  '#96CEB4', // xanh lá nhạt
  '#FFEEAD', // vàng nhạt
  '#D4A5A5', // hồng đất
  '#9FA4C4', // tím nhạt
  '#B5EAD7', // mint
  '#FFB7B2', // hồng pastel
  '#C7CEEA'  // xanh pastel
];

const ModernWheel = ({ 
  prizes = [
    { name: "iPhone 14", probability: 10 },
    { name: "AirPods", probability: 20 },
    { name: "Voucher 500k", probability: 30 },
    { name: "Chúc may mắn", probability: 40 }
  ],
  size = 400,
  spinDuration = 5000,
  colors = DEFAULT_COLORS // Cho phép truyền vào mảng màu tùy chỉnh
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const currentRotation = useRef(0);

  // Tính tổng tỉ lệ
  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

  // Tính góc cho mỗi phần
  const sliceAngle = 360 / prizes.length;

  // Lấy màu cho phần thưởng
  const getPrizeColor = (index) => {
    return colors[index % colors.length];
  };

  // Chọn phần thưởng dựa trên tỉ lệ
  const selectPrize = () => {
    const random = Math.random() * totalProbability;
    let sum = 0;
    
    for (let prize of prizes) {
      sum += prize.probability;
      if (random <= sum) return prize;
    }
    return prizes[prizes.length - 1];
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const selectedPrize = selectPrize();
    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
    
    // Tính góc quay
    const minSpins = 5;
    const maxSpins = 10;
    const extraSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1) + minSpins);
    const targetRotation = extraSpins * 360 + (360 - (prizeIndex * sliceAngle));
    
    // Cập nhật rotation
    currentRotation.current += targetRotation;
    
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${currentRotation.current}deg)`;
    }
    
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedPrize);
    }, spinDuration);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Container cho wheel và mũi tên */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Vòng quay */}
        <div
          ref={wheelRef}
          className="absolute w-full h-full rounded-full overflow-hidden shadow-lg"
          style={{
            transition: `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`,
            transform: `rotate(0deg)`,
          }}
        >
          {prizes.map((prize, index) => {
            const rotation = index * sliceAngle;
            return (
              <div
                key={index}
                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                style={{
                  transform: `rotate(${rotation}deg) skewY(-${90 - sliceAngle}deg)`,
                  background: getPrizeColor(index),
                }}
              >
                <div 
                  className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-white text-center transform -rotate-[20deg]"
                  style={{ width: '120px' }}
                >
                  <p className="font-bold text-sm whitespace-nowrap">{prize.name}</p>
                  <p className="text-xs whitespace-nowrap">({prize.probability}%)</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mũi tên chỉ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-x-8 border-x-transparent border-b-[16px] border-b-red-500 z-10" />
        
        {/* Nút quay ở giữa */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 z-20 hover:bg-gray-50 active:bg-gray-100"
        >
          <span className="text-sm font-bold text-gray-800">
            {isSpinning ? "..." : "QUAY"}
          </span>
        </button>
      </div>

      {/* Hiển thị kết quả */}
      {result && (
        <div className="text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-green-600">🎉 Chúc mừng!</h3>
          <p className="text-xl mt-2">Bạn đã trúng: {result.name}</p>
        </div>
      )}

      {/* Bảng tỉ lệ */}
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Tỉ lệ trúng thưởng:</h3>
        <div className="space-y-2">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded"
              style={{ backgroundColor: getPrizeColor(index) }}
            >
              <span className="text-white font-medium">{prize.name}</span>
              <span className="text-white font-bold">{prize.probability}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernWheel;