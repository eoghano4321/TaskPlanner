import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent, Vault, normalizePath } from 'obsidian';
import type {Moment, WeekSpec} from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';


import {SETTINGS} from "./Settings";
// These are the default values for the settings
// TODO - Add the ability to change those settings in the settings tab & have those values saved
// TODO - Have the settings variable check the loaded settings after await this.loadSettings(); and replace the defaults with those values

export const DefaultPluginSettings: SETTINGS = {
	OpenOnStart : false,
	SideButton : false,
	SendNotifs : false,
	StatusBar : false
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




	async onload(){
		await this.loadSettings();

		// const normalizedPath = normalizePath(`'Task'`);
		// const FileExists = await this.vault.adapter.exists(normalizedPath, false);

		this.addSettingTab(new SettingTab(this.app, this));

		// TODO Create a script to handle note creation
		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				//(file) => {
				// activeFile.setFile(file).createDailyNote(date)
				this.send_notif();
				//}.
			}	
		});

		this.addCommand({
			id: 'create_task_note',
			name: 'Create a Task Planner Note',
			callback: () => {
				this.createFileIfNotExists('TAskPlanner.md');
				
				
				// if (!FileExists){
				// 	this.vault.create(normalizedPath, `## TASKKKKKS`);
				// 	this.send_notif('File Created ');

				// }


			}

		});

	}

	async loadSettings() {
		this.settings = Object.assign({}, this.settings.OpenOnStart, await this.loadData());
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