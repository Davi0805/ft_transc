import { pitchToFrequency } from "./pitchToFrequency"

export type NoteT = {
    sound: string,
    pitch: string,
    startBeat: number,
    durationInBeats: number
}

export type SoundT = {
    soundName: string
    frequency: number,
    startTime: number,
    stopTime: number,
    maxGain: number
}

type AudioTrackT = {
    tempoBPM: number,
    maxIndividualGain: number,
    notes: NoteT[]
}

export type AudioTrackManifestT = {
    trackName: string,
    track: AudioTrackT
}[]

type SoundSchedulerT = (ctx: AudioContext, mixGain: GainNode, sound: SoundT) => void

export type SoundsManifestT = {
    soundName: string,
    soundScheduler: SoundSchedulerT
}[]

class AudioPlayer {
    //This stuff needs to be in an init because the object, since it is a singleton,
    // is constructed on page load and if a new AudioContext() is called there,
    // the browser complains that a sound was attemped to be played on load, which is a no-no
    init() {
        this._ctx = new AudioContext();
        this._mixGain = this.ctx.createGain();
        this._mixGain.gain.setValueAtTime(0.7, this.ctx.currentTime)
        
        const compressor = this.ctx.createDynamicsCompressor();
        this.mixGain.connect(compressor).connect(this.ctx.destination);

        //For some reason, at least in my firefox, the first low frequency sounds after creating a context
        // are super distorted. This cleans them up. Not the nicest of fixes, but seems to work
        this._cleanSoundObjects();
    }

    loadSounds(soundsManifest: SoundsManifestT) {
        soundsManifest.forEach(sound => {
            this._soundsMap.set(sound.soundName, sound.soundScheduler);
        })
    }

    loadTracks(audioTrackManifest: AudioTrackManifestT) {
        audioTrackManifest.forEach(track => {
            this._trackMap.set(track.trackName, track.track);
        })
    }

    playTrack(trackName: string, speed: number) {
        const track = this._trackMap.get(trackName);
        if (!track) {throw Error("This track does not exist")};

        const now = this.ctx.currentTime
        const beatDuration = 60 / track.tempoBPM;

        const sounds: SoundT[] = track.notes.map(note => {
            const startTime = now + (note.startBeat - 1) * beatDuration * speed;
            return {
                soundName: note.sound,
                frequency: pitchToFrequency(note.pitch),
                startTime: startTime,
                stopTime: startTime + (note.durationInBeats * beatDuration * speed),
                maxGain: track.maxIndividualGain
            }
        })

        this.tracksActive++;
        const lastSound = sounds.reduce((latestSound, sound) => {
            return sound.stopTime > latestSound.stopTime ? sound : latestSound;
        })
        const dummy = this.ctx.createBufferSource();
        dummy.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
        dummy.start(lastSound.stopTime);
        dummy.onended = () => {
            this.tracksActive--;
        };

        sounds.forEach(sound => this.scheduleSound(sound))
    }

    scheduleSound(sound: SoundT) {
        const makeSound = this._soundsMap.get(sound.soundName);
        if (!makeSound) {throw Error("This sound scheduler does not exist!")}

        makeSound(this.ctx, this.mixGain, sound);
    }

    private _tracksActive: number = 0;
    get tracksActive() { return this._tracksActive}
    set tracksActive(newValue: number) {
        this._tracksActive = newValue;
        const newGain = newValue === 0 ? 1 : (1 / Math.sqrt(newValue))
        this.mixGain.gain.setTargetAtTime(newGain * 0.7, this.ctx.currentTime, 0.1);
    }

    private _ctx: AudioContext | null = null;
    get ctx() {
        if (!this._ctx) {throw Error("Audio context not initialized!")};
        return this._ctx;
    }
    private _mixGain: GainNode | null = null;
    get mixGain() {
        if (!this._mixGain) {throw Error("mixGain not initialized!")};
        return this._mixGain;
    }

    private _soundsMap = new Map<string, SoundSchedulerT>();
    private _trackMap = new Map<string, AudioTrackT>();

    private _cleanSoundObjects() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.mixGain);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
        osc.disconnect();
        gain.disconnect();
    }
}

export const audioPlayer = new AudioPlayer();

