import { soundManager } from '@/shared/utils/sound-manager';

export default function useSound(name: string) {
    return {
        play: () => soundManager.play(name),
        unlock: () => soundManager.unlockAll(),
    };
}
