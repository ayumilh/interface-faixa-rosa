"use client";
import React from "react";

const UserPremium = ({ onUpgrade }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seja Faixa Rosa Premium</h2>
      <p>Obtenha benefícios exclusivos, descontos, acesso prioritário e muito mais ao se tornar Premium.</p>
      <button
        onClick={onUpgrade}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
      >
        Fazer Upgrade
      </button>
    </div>
  );
};

export default UserPremium;
