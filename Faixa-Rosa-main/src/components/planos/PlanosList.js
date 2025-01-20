import React from "react";

export default function PlanosList({ planDetails, selectedPlans, togglePlan }) {
  return (
    <ul className="space-y-4">
      {Object.keys(planDetails).map((planKey) => {
        const plan = planDetails[planKey];
        return (
          <li
            key={planKey}
            className="flex items-center justify-between text-gray-700"
          >
            <div className="flex items-center gap-2">
              {plan.icon}
              <span className={`text-lg font-bold ${plan.color}`}>
                {plan.name}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${plan.bg}`}>
                +{plan.points} pontos de listagem
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedPlans[planKey]}
                onChange={() => togglePlan(planKey)}
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-pink-500 peer-focus:ring-2 peer-focus:ring-pink-300 transition-all duration-300"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
