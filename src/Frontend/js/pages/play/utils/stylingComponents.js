export function getButtonHTML(id, type, text) {
    return `
    <button id="${id}" type="${type}" class="bg-gray-900/50 bg-opacity-60 p-5 rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25">${text}</button>
    `
}