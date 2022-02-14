import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent, Vault, normalizePath, moment } from 'obsidian';
import type {Moment, WeekSpec } from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';

import {FileCreator} from "./CreateTaskNote"
import {Notifications} from './Notifs';
import {SETTINGS} from "./Settings";
// import { text } from 'stream/consumers';
// import { send } from 'process';



// This was removed from package.json as it was causing an issue with tsconfig
// "@types/node": "^16.11.6",

let date: Moment;
 



declare global {
	interface Window {
	  app: App;
	  moment: () => Moment;
	  _bundledLocaleWeekSpec: WeekSpec;
	}
  }

export default class MyTaskPlugin extends Plugin {
	vault : Vault;
	settings: SETTINGS;
	ribbonIconEl: HTMLElement | undefined = undefined;
	filecreator : FileCreator;
	notifications : Notifications 
	

	async loadSettings() {
		// this.settings = Object.assign({}, this.settings, await this.loadData());
		this.settings = Object.assign(new SETTINGS(), await this.loadData());
		//this.add_side_button();
	}

	

	async onload(){
		await this.loadSettings();
		this.add_side_button();
		
		this.vault = this.app.vault;
		this.notifications = new Notifications(this.vault);
		this.filecreator = new FileCreator(this.vault, this.app, this.settings)

		// const normalizedPath = normalizePath(`'Task'`);
		// const FileExists = await this.vault.adapter.exists(normalizedPath, false);

		// this.notifications.send_notif(`${this.settings.OpenOnStart}, ${this.settings.SideButton}, ${this.settings.CustomFolder}, ${this.settings.DateFormat}`)

		this.addSettingTab(new SettingTab(this.app, this));
		
		if (this.settings.OpenOnStart){
			await this.app.workspace.onLayoutReady
			this.filecreator.open_note()
		}



		// TODO Create a script to open note on startup
		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				//(file) => {
				// activeFile.setFile(file).createDailyNote(date)
				new Notice('opening file', 0.2)
				this.filecreator.open_note()
				//}.
			}	
		});

		// TODO add a function to create a folder if 1 doesn't exist
		// TODO add date to file name
		this.addCommand({
			id: 'create_task_note',
			name: 'Create a Task Planner Note',
			callback: () => {
				this.filecreator.createFileIfNotExists(this.settings.CustomFile);
				
				
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

	

	

	public add_side_button(){
		this.ribbonIconEl?.remove();
		if (this.settings.SideButton ){	
			this.ribbonIconEl = this.addRibbonIcon('crossed-star', 'Open Task Planner', (evt: MouseEvent) => {
				// Called when the user clicks the icon.
			//	new Notice('Plugin clicked!');
				new Notice('opening file')
				this.filecreator.open_note(this.settings.CustomFile);
			});
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
						this.plugin.notifications.send_notif(`This is the on start setting `,this.plugin.settings.OpenOnStart);
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
						this.plugin.notifications.send_notif(`This is the sidebutton setting `, this.plugin.settings.SideButton);
						this.plugin.add_side_button();
						this.plugin.saveSettings();
						//await this.plugin.loadSettings();
				}));	
		
		new Setting(containerEl)
				.setName('Custom Folder')
				.setDesc('Set a custom folder to save the task notes in')
				.addText(text => text
					.setPlaceholder('Folder')
					.setValue(this.plugin.settings.CustomFolder)
					.onChange(async (value) => {
						this.plugin.settings.CustomFolder = value;
						await this.plugin.saveSettings();
					}))
		
		new Setting(containerEl)
				.setName('Date Format')
				.setDesc('Date format for file name and task due dates\nDates in preexisting files need to be changed manually\nAutomatic date fixing coming soon')
				.addText(text => text
					.setPlaceholder('Date')
					.setValue(this.plugin.settings.DateFormat)
					.onChange(async (value) => {
						this.plugin.settings.DateFormat = value;
						await this.plugin.saveSettings();
					}))
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