import type { SoundT } from "./AudioPlayer"

export function hollow(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = sound.frequency;

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(sound.maxGain, sound.startTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, sound.stopTime);

    osc.connect(oscGain).connect(output);
    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
}


export function explosion(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const rumble = ctx.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(1, ctx.currentTime);
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, sound.stopTime);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(150, sound.startTime);
    noiseFilter.Q.value = 1;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, sound.stopTime);

    const finalGain = ctx.createGain();
    finalGain.gain.setValueAtTime(0.001, sound.startTime);
    finalGain.gain.linearRampToValueAtTime(sound.maxGain * 3, sound.startTime + 0.01);
    finalGain.gain.setValueAtTime(sound.maxGain * 3, sound.startTime + 0.4);
    finalGain.gain.linearRampToValueAtTime(0.001, sound.stopTime)

    rumble.connect(rumbleGain).connect(finalGain);
    noise.connect(noiseFilter).connect(noiseGain).connect(finalGain);
    finalGain.connect(output)

    rumble.start(sound.startTime);
    rumble.stop(sound.stopTime);
    noise.start(sound.startTime)
}

export function sine(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, 0.001);
    gain.gain.setValueAtTime(sound.maxGain, 0.001);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(gain).connect(envelope).connect(output);

    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
}

export function triangle(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(sound.frequency, 0.001);
    gain.gain.setValueAtTime(sound.maxGain, 0.001);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(gain).connect(envelope).connect(output);

    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
}

export function kick(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    const gainOsc = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency * 2.5, sound.startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, sound.stopTime);
    gainOsc.gain.setValueAtTime(1, sound.startTime);
    gainOsc.gain.exponentialRampToValueAtTime(0.01, sound.stopTime);
    osc.connect(gainOsc);
    gainOsc.connect(output);

    const osc2 = ctx.createOscillator();
    const gainOsc2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(sound.frequency, sound.startTime);
    gainOsc2.gain.setValueAtTime(1, sound.startTime);
    gainOsc2.gain.exponentialRampToValueAtTime(0.01, sound.stopTime);
    osc2.connect(gainOsc2);
    gainOsc2.connect(output);

    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
    osc2.start(sound.startTime);
    osc2.stop(sound.stopTime);
}

export function tone1(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, sound.startTime);
    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(envelope).connect(output);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(sound.frequency * 2, sound.startTime);
    const envelope2 = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc2.connect(envelope2).connect(output);

    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
    osc2.start(sound.startTime);
    osc2.stop(sound.stopTime);
}

export function rising(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, sound.startTime);
    osc.frequency.linearRampToValueAtTime(sound.frequency * 8, sound.stopTime);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(envelope).connect(output);
    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
}

export function falling(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, sound.startTime);
    osc.frequency.linearRampToValueAtTime(sound.frequency / 8, sound.stopTime);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime)
    osc.connect(envelope).connect(output);
    osc.start(sound.startTime);
    osc.stop(sound.stopTime);
}

export function increasing(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, sound.startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, sound.startTime);
    gain.gain.linearRampToValueAtTime(sound.maxGain, sound.stopTime);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(gain).connect(envelope).connect(output);
    osc.start(sound.startTime);
    osc.stop(sound.stopTime)
}

export function decreasing(ctx: AudioContext, output: GainNode, sound: SoundT) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(sound.frequency, sound.startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(sound.maxGain, sound.startTime);
    gain.gain.linearRampToValueAtTime(0.001, sound.stopTime);

    const envelope = createEnvelope(ctx, sound.startTime, sound.stopTime);
    osc.connect(gain).connect(envelope).connect(output);
    osc.start(sound.startTime);
    osc.stop(sound.stopTime)
}



function createEnvelope(ctx: AudioContext, startTime: number, stopTime: number) {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(1, startTime + 0.05);
    gain.gain.setValueAtTime(1, stopTime - 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime - 0.01)
    return gain
}