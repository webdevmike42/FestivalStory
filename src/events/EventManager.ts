import { sceneEvents } from "./EventCenter";

export enum GAME_EVENTS {
    PLAYER_ATTEMPT_OPEN_CHEST = "player-attempt-open-chest",
    PLAYER_HEALTH_CHANGED = "player-health-changed",
    PLAYER_COINS_CHANGED = "player-coins-changed",
    PLAYER_HURT_BY_ENEMY = "player-hurt-by-enemy",
    CHEST_OPENED = "chest_opened",
    CHEST_CLOSED = "chest_closed",
    DESTROY_PLAYER_LIZARD_COLLIDER = "destroy-player-lizard-collider",
    LIZARD_HURT = "lizard-hurt"
}

export class EventManager {
    static sceneEvents = new Phaser.Events.EventEmitter();

    static on(event: string, callback: Function, context?: any) {
        sceneEvents.off(event); // Alte Listener entfernen
        sceneEvents.on(event, callback, context); // Neuer Listener hinzufügen
    }

    static off(event: string) {
        sceneEvents.off(event); // Listener entfernen
    }

    static emit(event:string, ...args:any) {
        sceneEvents.emit(event, ...args);
    } 
}
