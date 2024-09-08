import { sceneEvents } from "./EventCenter";

export class EventManager {

    static on(event: string, callback: Function, context?: any) {
        sceneEvents.off(event); // Alte Listener entfernen
        sceneEvents.on(event, callback, context); // Neuer Listener hinzufügen
    }

    static off(event: string) {
        sceneEvents.off(event); // Listener entfernen
    }
}
