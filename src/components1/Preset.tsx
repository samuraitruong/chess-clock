"use client";

import React, { useState } from "react";
import { MdExitToApp, MdAccessTime, MdClose } from "react-icons/md";

const presets = [
  "1 min",
  "3 min",
  "3 min | 2 sec",
  "5 min | 3 sec",
  "10 min | 5 sec",
  "15 min | 15 sec",
  "30 min | 30 sec",
  "60 min | 30 sec",
  "90 min | 30 sec",
];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function PresetDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;
  const [min, setMin] = useState("10");
  const [sec, setSec] = useState("5");

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const setCustomHandle = () => {
    onClose(`${min} min | ${sec} sec`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Change timer</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Preset List */}
        <div className="max-h-60 overflow-y-auto">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleListItemClick(preset)}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
            >
              <MdAccessTime className="text-blue-500 text-xl mr-3" />
              <span className="text-gray-900">{preset}</span>
            </button>
          ))}
        </div>

        {/* Custom Timer Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutes
              </label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seconds
              </label>
              <input
                type="number"
                value={sec}
                onChange={(e) => setSec(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={setCustomHandle}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <MdExitToApp className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
