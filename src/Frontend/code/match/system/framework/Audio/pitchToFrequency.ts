const pitchToFrequencyTable = {
    "C": 16.3516,
    "C#": 17.3239,
    "Db": 17.3238,
    "D": 18.3541,
    "D#": 19.4455,
    "Eb": 19.4454,
    "E": 20.6017,
    "F": 21.8268,
    "F#": 23.1247,
    "Gb": 23.1246,
    "G": 24.4997,
    "G#": 25.9566,
    "Ab": 25.9565,
    "A": 27.5,
    "A#": 29.1352,
    "Bb": 29.1352,
    "B": 30.8677,
} as const;

export function pitchToFrequency(pitch: string): number {
    const pitchInfo = getPitchInfo(pitch);
    return pitchToFrequencyTable[pitchInfo.note] * Math.pow(2, pitchInfo.octave)
}

function getPitchInfo(input: string): { note: keyof typeof pitchToFrequencyTable, octave: number } {
    if (input.length < 2) throw Error("string is not note!");
    const note = input.slice(0, -1);
    const lastChar = input.slice(-1);
    const octave = parseInt(lastChar, 10);
    if (isNaN(octave)) { throw Error("String is not note!") };
    if (!(note in pitchToFrequencyTable)) {throw Error()}
    const noteCasted = note as keyof typeof pitchToFrequencyTable;
    return { note: noteCasted, octave: octave };
}