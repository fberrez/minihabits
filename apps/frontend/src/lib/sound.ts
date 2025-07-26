// Import the audio file using a relative path

const successSound = new Audio('/success.mp3');

export const playSuccessSound = () => {
  successSound.currentTime = 0; // Reset the sound to start
  successSound.volume = 0.2; // Set volume to 20%
  successSound.play().catch(() => {
    // Ignore errors - some browsers block autoplay
  });
};
