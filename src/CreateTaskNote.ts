import MyTaskPlugin, {} from './main'
import {SETTINGS} from "./Settings";
import {App, normalizePath, moment, Vault, Notice} from 'obsidian'
import { Notifications } from './Notifs';
import { Parser } from './Parser';



export  class FileCreator {
    app : App;
    vault : Vault ;
	settings: SETTINGS;
    notifications : Notifications;
    parser : Parser;
    plugin : MyTaskPlugin;

    constructor(vault : Vault, app : App, settings : SETTINGS, plugin : MyTaskPlugin){
        this.vault = vault;
        this.app = app;
        this.settings = settings;
        this.plugin = plugin;
        this.parser = new Parser(this.vault, this.settings, this.plugin);
    }

    

    async createFileIfNotExists(fileName: string) {
        this.notifications = new Notifications(this.vault, this.settings)
        
        await this.createFolderIfNotExists(this.settings.CustomFolder)
        try {

            const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + fileName + `.md`);
            if (!await this.vault.adapter.exists(normalizedFileName, false)) {
                await this.vault.create(normalizedFileName, `## Tasks
- [ ] `);
                //this.notifications.send_notif(normalizedFileName)
                this.open_note(this.settings.CustomFile)
                this.parser.parse_for_tasks()
                //this.notifications.send_notif(String(await this.parser.parse_for_tasks()))
            }
            else{
                new Notice(`File ${normalizedFileName} already exists`)
            }
        } catch (error) {
            this.notifications.send_notif(`Error ${error}`)
        }
    }

    async createFolderIfNotExists(folderName: string){
        try {
            const normalizedPath = normalizePath(folderName);
            const folderExists = await this.vault.adapter.exists(normalizedPath, false)
            if(!folderExists) {
              await this.vault.createFolder(normalizedPath);
            }
        } catch (error) {
            new Notice(error)
        }
    }

    async open_note(note: string = `Task_Planner`){
        
		try{
			if (await this.vault.adapter.exists(await normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + note + `.md`), false)) {
				//new Notice('File exists ... opening')
                
				await this.app.workspace.openLinkText(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + note + `.md`, '', false, {                    
					active: true,
				});
                new Notice("Opened")
			}
			else{
				new Notice('File doesn\'t exist .... Creating file')
				this.createFileIfNotExists(note)
			}
		} catch (error){
			this.notifications.send_notif(`Error ${error}`);
			
		}
	}

}