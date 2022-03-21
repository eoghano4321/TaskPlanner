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
            let task_path = this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + fileName + `.md`;
            const normalizedFileName = normalizePath(task_path);
            const task_file = this.vault.getAbstractFileByPath(task_path) as TFile;
            if (!this.vault.getFiles().contains(task_file)) {
                await this.vault.create(normalizedFileName, `## Tasks
- [ ] `);
                this.open_note(task_path)
                this.parser.parse_for_tasks()
            }
            
        } catch (error) {
            console.log(`Error ${error}`);
            
        }
    }

    async createFolderIfNotExists(folderName: string){
        try {
            
            const normalizedPath = normalizePath(folderName);
            
            if(!this.vault.getRoot().children.contains(this.vault.getAbstractFileByPath(folderName))) {
              await this.vault.createFolder(normalizedPath);
            }
        } catch (error) {
            new Notice(error)
        }
    }
    
    async open_note(note_path: string = `Task_Planner`){
        const task_file = this.vault.getAbstractFileByPath(note_path) as TFile;
		try{
			if (task_file instanceof TFile) {
                
				await this.app.workspace.openLinkText(task_file.path, '', true, {                    
					active: true,
				});
                
			}
			else{
				
				this.createFileIfNotExists("Task_Planner")
			}
		} catch (error){
			console.log(`Error ${error}`);
			
		}
	}

}