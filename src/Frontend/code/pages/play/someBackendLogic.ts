import { TMatchDuration, TMapType, TLobby, TMatchPlayer } from "./lobbyTyping"
import { TUserCustoms } from "../../match/matchSharedDependencies/SetupDependencies"

export function getSecondsFromDuration(duration: TMatchDuration) {
    const durationToSeconds: Record<TMatchDuration, number> = {
        "blitz": 60,
        "rapid": 90,
        "classical": 120,
        "long": 150,
        "marathon": 180
    }
    return durationToSeconds[duration]
}

export function getStartingScoreFromDuration(duration: TMatchDuration) {
    const durationToScore: Record<TMatchDuration, number> = {
        "blitz": 100,
        "rapid": 150,
        "classical": 200,
        "long": 250,
        "marathon": 300
    }
    return durationToScore[duration]
}

export function getSizeFromMap(map: TMapType) {
    const [_amountStr, _type, size] = map.split("-");
    switch (size) {
        case "small": return { x: 500, y: 500 }
        case "medium": return { x: 700, y: 700 }
        case "big": return { x: 900, y: 900 }
        default: throw Error("Size not detected!");
    }
}

export function buildUserCustoms(settings: TLobby, players: TMatchPlayer[]): TUserCustoms {
    const userCustoms: TUserCustoms = {
        field: {
            size: getSizeFromMap(settings.map),
            backgroundSpriteID: 0 //TODO: Generate randomly
        },
        matchLength: getSecondsFromDuration(settings.duration),
        startingScore: getStartingScoreFromDuration(settings.duration),
        paddles: [],
        clients: [],
        bots: []
    }

    const paddleID = 0;
    players.forEach(player => {
        if (player.userID === null || player.id === null || player.spriteID === null) {
            throw Error("This player is not initialized!!");
        }

        userCustoms.paddles.push({
            id: paddleID,
            side: player.team,
            role: player.role,
            spriteID: player.spriteID
        })

        const human = {
            id: player.id,
            paddleID: paddleID,
            controls: {
                left: "ArrowLeft", //TODO: probably get these from lobby
                right: "ArrowRight",
                pause: " " //TODO: Deprecated. To be removed
            }
        }
        const client = userCustoms.clients.find(client => client.id === player.userID);
        if (client) {
            client.humans.push(human);
        } else {
            userCustoms.clients.push({
                id: player.userID,
                humans: [human]
            })
        }
        
    })
    //TODO: Have to find a way to build bots into empty slots

    return userCustoms
}