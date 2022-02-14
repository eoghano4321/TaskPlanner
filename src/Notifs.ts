import {SETTINGS} from "./Settings";
import {App, normalizePath, moment, Vault, MarkdownView} from 'obsidian'


export class Notifications {
    vault : Vault;

    constructor(vault: Vault){
        this.vault = vault;
    }

    public send_notif(message: string = `This is a test notification`, test?: boolean) {
		new Notification(`Task Planner`, { body: message, requireInteraction: true });
	}

    public send_task_notif(message: string = `This is a test notification`, header: string = `Task Due`) {
		new Notification(header, { body: message, requireInteraction: true });
	}
    
}