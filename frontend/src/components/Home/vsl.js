import { useEffect, useState, useRef, useCallback, memo } from "react";
import { PlayCircle, PauseCircle, SpeakerHigh, SpeakerX } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const VideoSection = memo(() => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Toggle play/pause otimizado
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);

    if (video.paused) {
      video.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao tentar reproduzir o vídeo:", error);
          setIsLoading(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  // Toggle mute otimizado
  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Update progress
  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent || 0);
    }
  }, []);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHydrated) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = updateProgress;
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isHydrated, updateProgress]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="flex flex-col items-center py-8 md:py-12 px-4 bg-white -mt-4 md:-mt-6">
      {/* Título Otimizado */}
      <motion.div
        className="text-center mb-6 md:mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight max-w-4xl mx-auto px-2">
          A{" "}
          <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            Nova Era
          </span>{" "}
          da{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent">
            Publicidade Digital
          </span>{" "}
          chegou ao Brasil!
        </h2>
      </motion.div>

      {/* Container do Vídeo Otimizado */}
      <motion.div
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative group">
          {/* Video Container */}
          <div
            className="aspect-video bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
            onClick={togglePlayPause}
          >
            {/* Video Element */}
            {isHydrated && (
              <video
                ref={videoRef}
                src="/vd-faixarosa-01.mp4"
                poster="/thumb-vd-faixarosa.jpg"
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            )}

            {/* Overlay de Play/Loading */}
            <AnimatePresence>
              {(!isPlaying && isHydrated) && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[1px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 md:w-20 md:h-20 border-4 border-pink-500/30 border-t-pink-500 rounded-full"
                    />
                  ) : (
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <PlayCircle
                        size={60}
                        weight="fill"
                        className="text-pink-500 md:w-20 md:h-20 drop-shadow-2xl"
                      />
                      <span className="text-white text-sm md:text-lg font-semibold mt-2 md:mt-3 drop-shadow-lg">
                        Clique para assistir
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <AnimatePresence>
              {isPlaying && isHydrated && (
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Control Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      onClick={toggleMute}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMuted ? (
                        <SpeakerX size={16} className="md:w-5 md:h-5" weight="bold" />
                      ) : (
                        <SpeakerHigh size={16} className="md:w-5 md:h-5" weight="bold" />
                      )}
                    </motion.button>
                  </div>

                  {/* Play/Pause Button Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={togglePlayPause}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PauseCircle size={40} className="md:w-12 md:h-12" weight="fill" />
                    </motion.button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="w-full bg-white/20 rounded-full h-1 md:h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {!isHydrated && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-pink-500/30 border-t-pink-500 rounded-full"
                />
              </div>
            )}
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </div>

        {/* Video Info */}
        <motion.div
          className="mt-4 md:mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm md:text-base font-medium">
            Descubra como revolucionamos a publicidade digital no Brasil
          </p>
          {duration > 0 && (
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              Duração: {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;