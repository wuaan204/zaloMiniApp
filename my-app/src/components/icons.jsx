import React from "react";

// Nút Back dùng chung cho mọi màn hình: chỉ có mũi tên, không có chữ "Quay lại"
export function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quay lại"
      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-center shrink-0 active:bg-blue-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

// Biểu tượng kính lúp đặt bên trong ô tìm kiếm
export function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
