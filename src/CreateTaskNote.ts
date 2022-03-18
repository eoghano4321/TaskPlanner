import MyTaskPlugin, {} from './main'
import {SETTINGS} from "./Settings";
import {App, normalizePath, moment, Vault, Notice, TFile, TFolder} from 'obsidian'
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
            const task_file = this.vault.getAbstractFileByPath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + fileName + `.md`) as TFile;
            if (!this.vault.getFiles().contains(task_file)) {
                await this.vault.create(normalizedFileName, `## Tasks
- [ ] `);
                this.open_note(this.settings.CustomFile)
                this.parser.parse_for_tasks()
            }
            
        } catch (error) {
            console.log(`Error ${error}`);
            //this.notifications.send_notif(`Error ${error}`)
        }
    }

    async createFolderIfNotExists(folderName: string){
        try {
            
            const normalizedPath = normalizePath(folderName);
            //const folderExists = this.vault.getRoot().children.contains(this.vault.getAbstractFileByPath(folderName); //await this.vault.adapter.exists(normalizedPath, false)
            if(!this.vault.getRoot().children.contains(this.vault.getAbstractFileByPath(folderName))) {
              await this.vault.createFolder(normalizedPath);
            }
        } catch (error) {
            new Notice(error)
        }
    }
    
    async open_note(note: string = `Task_Planner`){
        const task_file = this.vault.getAbstractFileByPath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + note + `.md`) as TFile;
		try{
			if (this.vault.getFiles().contains(task_file)) {
                
				await this.app.workspace.openLinkText(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + note + `.md`, '', true, {                    
					active: true,
				});
                //new Notice("Opened")
			}
			else{
				//new Notice('File doesn\'t exist .... Creating file')
				this.createFileIfNotExists(note)
			}
		} catch (error){
			console.log(`Error ${error}`);
			
		}
	}

}