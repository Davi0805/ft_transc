export function getButton(id, type, text, big = true) {
    const out = document.createElement("button");
    out.id = id;
    out.type = type;
    out.className = `bg-gray-900/50 bg-opacity-60 ${big ? "p-5" : "p-2"} rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25`;
    out.textContent = text;

    return out
}