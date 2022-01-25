import {SETTINGS} from "./Settings";
import {App, normalizePath, moment, Vault, MarkdownView} from 'obsidian'


export class Notifications {
    vault : Vault;

    constructor(vault: Vault){
        this.vault = vault;
    }

    public send_notif(message: string = `This is a test notification`, test?: boolean) {
		new Notification(`Test Notif`, { body: message, requireInteraction: true });
	}
    
}