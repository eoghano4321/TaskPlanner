import {SETTINGS} from "./Settings";
import {App, normalizePath, moment, Vault, MarkdownView} from 'obsidian'


export class Notifications {
    vault : Vault;
    settings : SETTINGS;

    constructor(vault: Vault, settings : SETTINGS){
        this.vault = vault;
        this.settings = settings;
    }

    public send_notif(message: string = `This is a test notification`, test?: boolean) {
      if (this.settings.SendNotifs){
		    new Notification(`Task Planner`, { body: message, requireInteraction: true });
      }
    }

    public send_task_notif(message: string = `This is a test notification`, header: string = `Task Due`) {
      if (this.settings.SendNotifs){
		   new Notification(header, { body: message, requireInteraction: true });
      }
	}
    
}