// src/components/BiometricAnimation.tsx
import { useEffect, useState } from 'react';

export const BiometricAnimation = () => {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(prev => prev === 1 ? 1.2 : 1);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 animate-in fade-in duration-300">
      <div className="card max-w-md mx-4 p-8 text-center">
        {/* Círculos pulsantes */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Círculo externo */}
          <div 
            className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse-slow"
            style={{
              transform: `scale(${pulseScale})`,
              transition: 'transform 0.8s ease-in-out'
            }}
          />
          
          {/* Círculo médio */}
          <div 
            className="absolute inset-6 rounded-full bg-purple-600/40 animate-pulse-slow"
            style={{
              animationDelay: '0.3s',
              transform: `scale(${pulseScale})`,
              transition: 'transform 0.8s ease-in-out'
            }}
          />
          
          {/* Círculo interno com ícone */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow">
            <span className="text-6xl animate-pulse">👆</span>
          </div>
        </div>

        {/* Texto */}
        <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
          Iniciando autenticação
        </h2>
        <p className="text-purple-300 text-lg mb-8 max-w-md mx-auto">
          Preparando para confirmar sua biometria
        </p>

        {/* Barras de loading animadas */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-12 bg-purple-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CreatingWalletAnimation = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 animate-in fade-in duration-300">
      <div className="card max-w-md mx-4 p-8 text-center">
        {/* Ícone animado */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute inset-2 rounded-full bg-gray-900" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">🔐</span>
          </div>
        </div>

        {/* Texto */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Autenticando e criando carteira gasless
        </h2>
        <p className="text-purple-300 text-lg mb-8 max-w-md mx-auto">
          Confirmando biometria e gerando chaves seguras
        </p>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-purple-400 mt-3">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export const SuccessAnimation = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 p-4">
      <div className={`card max-w-md mx-4 p-8 text-center transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        {/* Confetti effect */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 md:mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-glow-green animate-pulse">
            <div className="absolute inset-3 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-7xl">✅</span>
            </div>
          </div>
          
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-80px)`,
                animation: 'float 2s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Texto */}
        <h2 className="text-4xl font-bold text-white mb-4 animate-in fade-in duration-500">
          Carteira criada! 🎉
        </h2>
        <p className="text-green-300 text-xl mb-4 max-w-md mx-auto">
          Sua carteira gasless está pronta
        </p>
        <p className="text-purple-300 text-sm">
          Redirecionando para o dashboard...
        </p>
      </div>
    </div>
  );
};

export const PulseCircle = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-full h-full rounded-full border-2 border-purple-500/30 animate-ping"
          style={{
            animationDelay: `${i * 0.5}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
};