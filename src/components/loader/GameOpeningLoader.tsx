import React from "react";


const GameOpeningLoader: React.FC = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#006165]">
      <div className="loader-container">
        {/* 36 area divs */}
        {[...Array(36)].map((_, i) => (
          <div key={i} className="area"></div>
        ))}

        <button className="reload-btn" onClick={() => window.location.reload()}>
          Reload
        </button>

        <div className="loader-game">
          <p className="text">LOADING...</p>

          <span style={{ "--i": 100, "--d": 0 } as React.CSSProperties}></span>

          <div className="groove">
            <span
              style={{ "--i": 50, "--d": 100 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 30, "--d": 150 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 50, "--d": 180 } as React.CSSProperties}
            ></span>
          </div>

          <span style={{ "--i": 10, "--d": 230 } as React.CSSProperties}></span>

          <div className="groove">
            <span
              style={{ "--i": 100, "--d": 240 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 15, "--d": 340 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 140, "--d": 355 } as React.CSSProperties}
            ></span>
          </div>

          <span style={{ "--i": 60, "--d": 495 } as React.CSSProperties}></span>

          <div className="groove">
            <span
              style={{ "--i": 60, "--d": 555 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 50, "--d": 615 } as React.CSSProperties}
            ></span>
            <span
              style={{ "--i": 20, "--d": 665 } as React.CSSProperties}
            ></span>
          </div>

          <span style={{ "--i": 40, "--d": 685 } as React.CSSProperties}></span>
        </div>
      </div>
    </div>
  );
};

export default GameOpeningLoader;
