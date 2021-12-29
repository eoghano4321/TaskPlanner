import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent } from 'obsidian';
import type {Moment, WeekSpec} from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';


import {SETTINGS} from "./Settings";
// These are the default values for the settings
// TODO - Add the ability to change those settings in the settings tab & have those values saved
// TODO - Have the settings variable check the loaded settings after await this.loadSettings(); and replace the defaults with those values

const DefaultPluginSettings: SETTINGS = {
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
	settings = DefaultPluginSettings;

	async onload(){
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		// TODO Create a script to handle note creation
		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				//(file) => {
				// activeFile.setFile(file).createDailyNote(date)
				this.send_notif(true);
				//}.
			}	
		});

	}

	async loadSettings() {
		this.settings = Object.assign({}, this.settings.OpenOnStart, await this.loadData());
	}

	public send_notif(test?: boolean) {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView) {
			new Notification(`Test Notif`, { body: `This is a test notification ${test}`, requireInteraction: true });
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
			.setDesc('Open the days task planner on startup')

			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.OpenOnStart)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.OpenOnStart = value;
						await this.plugin.send_notif(this.plugin.settings.OpenOnStart);
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