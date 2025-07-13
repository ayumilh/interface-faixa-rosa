import React from "react";
import { useMediaQuery } from "react-responsive"; // Para detectar o tamanho da tela
import MobileChart from "../components/dashboard/MobileChart"; // Segundo gráfico
import Charts from "../components/dashboard/Charts"; // Gráfico original

const ResponsiveCharts = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detecta telas menores que 768px

  return (
    <div className="mb-6">
      {isMobile ? (
        <div
          className="relative w-full"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Gráfico específico para mobile */}
          <div className="w-[90%] h-[300px]">
            <MobileChart className="w-full h-full" />
          </div>
        </div>
      ) : (
        <div
          className="relative w-full"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Gráfico original */}
          <div className="w-[80%] h-[500px]">
            <Charts className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCharts;
