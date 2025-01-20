import React from "react";

export default function AnuncioCard({ totalPoints }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/3 flex flex-col items-center">
      <img
        src="/profile-placeholder.png" /* Substitua pelo caminho correto da imagem */
        alt="Perfil"
        className="w-32 h-32 rounded-full object-cover mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800">Paula Assunção</h2>
      <p className="text-sm text-gray-500 mb-2">Online</p>
      <p className="text-pink-500 font-bold text-lg">R$ 550/h</p>
      <ul className="text-sm text-gray-600 mt-4">
        <li>33 anos</li>
        <li>Tem local</li>
        <li>28 vídeos</li>
        <li>Partenon, Porto Alegre</li>
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        Total de pontos de listagem:{" "}
        <span className="font-bold text-pink-500">{totalPoints}</span>
      </p>
    </div>
  );
}
