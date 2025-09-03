type NoteT = {
    frequency: number,
    startBeat: number,
    durationBeats: number //in beats
}

type SoundT = {
    frequency: number,
    startTime: number,
    duration: number //in seconds
}

type AudioTrackT = {
    tempoBPM: number
    notes: NoteT[]
}

export type AudioManifestT = {
    audioName: string,
    audioTrack: AudioTrackT
}[]

class AudioPlayer {

    loadAudioManifest(audioManifest: AudioManifestT) {
        this._audioManifest = audioManifest;
    }

    playAudio(audioName: string, speed: number) {
        const audioInfo = this.audioManifest.find(audioToFind => audioToFind.audioName === audioName);
        if (!audioInfo) {throw Error("This audio does not exist in the manifest!")}

        const audio = audioInfo.audioTrack;
        const startAudioTime = this._ctx.currentTime;
        const sounds: SoundT[] = audio.notes.map(note => {
            const beatDuration = 60 / audio.tempoBPM
            return {
                frequency: note.frequency,
                startTime: startAudioTime + (note.startBeat - 1) * beatDuration * speed,
                duration: note.durationBeats * beatDuration * speed
            }
        }) 
        
        sounds.forEach(sound => this._scheduleSound(sound))
    }

    private _scheduleSound(sound: SoundT) {
        const oscillator = this._ctx.createOscillator();
        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(sound.frequency, sound.startTime);
        oscillator.connect(this._ctx.destination);
        oscillator.start(sound.startTime);
        oscillator.stop(sound.startTime + sound.duration)
    }

    private _ctx: AudioContext = new AudioContext();

    private _audioManifest: AudioManifestT | null = null;
    get audioManifest() {
        if (!this._audioManifest) {throw Error("Audio manifest was not loaded!")}
        return this._audioManifest;
    }

}

export const audioPlayer = new AudioPlayer()