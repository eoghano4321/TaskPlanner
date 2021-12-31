import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent, Vault, normalizePath } from 'obsidian';
import type {Moment, WeekSpec} from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';


import {SETTINGS} from "./Settings";
// These are the default values for the settings
// TODO - Add the ability to change those settings in the settings tab & have those values saved
// TODO - Have the settings variable check the loaded settings after await this.loadSettings(); and replace the defaults with those values
// TODO - Import a variable custom folder from the save data. Do not use the interface below as the path ends with undefined and doesn't work

export const DefaultPluginSettings: SETTINGS = {
	OpenOnStart : false,
	SideButton : false,
	SendNotifs : false,
	StatusBar : false,
	CustomFolder: `Task_Planners.md`,
}

let date: Moment;
 

declare global {
	interface Window {
	  app: App;
	  moment: () => Moment;
	  _bundledLocaleWeekSpec: WeekSpec;
	}
  }

export default class MyTaskPlugin extends Plugin {
	vault : Vault = this.app.vault;
	settings = DefaultPluginSettings;
	ribbonIconEl: HTMLElement | undefined = undefined;
	

	async loadSettings() {
		// this.settings = Object.assign({}, this.settings, await this.loadData());
		this.settings = Object.assign(new SETTINGS(), await this.loadData());
		//this.add_side_button();
	}



	async onload(){
		await this.loadSettings();
		this.add_side_button();
		

		// const normalizedPath = normalizePath(`'Task'`);
		// const FileExists = await this.vault.adapter.exists(normalizedPath, false);

		new Notice(`${this.settings.SideButton}`)

		this.addSettingTab(new SettingTab(this.app, this));




		// TODO Create a script to open note on startup
		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				//(file) => {
				// activeFile.setFile(file).createDailyNote(date)
				new Notice('opening file', 0.2)
				this.open_note()
				//}.
			}	
		});

		// TODO add a function to create a folder if 1 doesn't exist
		// TODO add date to fille name
		this.addCommand({
			id: 'create_task_note',
			name: 'Create a Task Planner Note',
			callback: () => {
				this.createFileIfNotExists(`Task_Planner.md`);
				
				
				// if (!FileExists){
				// 	this.vault.create(normalizedPath, `## TASKKKKKS`);
				// 	this.send_notif('File Created ');

				// }


			}

		});

	}

	

	async saveSettings(){
		await this.saveData(this.settings);

	}

	public send_notif(message: string = `This is a test notification`, test?: boolean) {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView) {
			new Notification(`Test Notif`, { body: message + `${test}`, requireInteraction: true });
			
		}
	}

	async createFileIfNotExists(fileName: string) {
		this.send_notif('DEBUG1')
        try {
            const normalizedFileName = normalizePath(fileName);
            if (!await this.vault.adapter.exists(normalizedFileName, false)) {
                await this.vault.create(normalizedFileName, `## TAslks
				- []`);
				this.send_notif(normalizedFileName)
            }
			else{
				this.send_notif(`File ${normalizedFileName} already exists`, true)
			}
        } catch (error) {
            this.send_notif(`Error ${error}`)
        }
    }

	public add_side_button(){
		if (this.settings.SideButton ){
			this.ribbonIconEl?.remove();
			this.ribbonIconEl = this.addRibbonIcon('crossed-star', 'Open Task Planner', (evt: MouseEvent) => {
				// Called when the user clicks the icon.
			//	new Notice('Plugin clicked!');
				new Notice('opening file', 0.2)
				this.open_note(`Task_Planner.md`);
			});
		}


	}

	async open_note(note: string = `Task_Planner.md`){
		try{
			if (await this.vault.adapter.exists(await normalizePath(note), false)) {
				new Notice('File exists ... opening')
				await this.app.workspace.openLinkText(note, '', true, {
					active: true,
				});
			}
			else{
				new Notice('File doesn\'t exist')
			}
		} catch (error){
			this.send_notif(`Error ${error}`);
			
		}
	}

}



export class SettingTab extends PluginSettingTab {
	plugin: MyTaskPlugin;

	constructor(app: App, plugin: MyTaskPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		
		containerEl.empty();

		containerEl.createEl('h2', {text: 'Task Planner Settings'});

		new Setting(containerEl)
			.setName('Open on Start')
			.setDesc('Open the Task Note on startup')

			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.OpenOnStart)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.OpenOnStart = value;
						this.plugin.send_notif(`This is the on start setting `,this.plugin.settings.OpenOnStart);
						this.plugin.saveSettings();
						//await this.plugin.loadSettings();
				}));
			
		new Setting(containerEl)
			.setName('Side Bar Button')
			.setDesc('Add a side bar button to open the Task Note')

			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.SideButton)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.SideButton = value;
						this.plugin.send_notif(`This is the sidebutton setting `, this.plugin.settings.SideButton);
						this.plugin.add_side_button();
						this.plugin.saveSettings();
						//await this.plugin.loadSettings();
				}));	
			

			// .addText(text => text
			// 	.setPlaceholder('Enter here')
			// 	.setValue(this.plugin.settings.mySetting)
			// 	.onChange(async (value) => {
			// 		console.log('Secret: ' + value);
			// 		this.plugin.settings.mySetting = value;
			// 		await this.plugin.saveSettings();
			// 	}));
	}
}