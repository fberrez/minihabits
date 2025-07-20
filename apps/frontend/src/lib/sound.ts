// Import the audio file using a relative path
import successSoundUrl from "../../public/success.mp3";

const successSound = new Audio(successSoundUrl);

export const playSuccessSound = () => {
  successSound.currentTime = 0; // Reset the sound to start
  successSound.volume = 0.2; // Set volume to 20%
  successSound.play().catch(() => {
    // Ignore errors - some browsers block autoplay
  });
};
