import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
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

export default class MyPlugin extends Plugin {
	settings = DefaultPluginSettings;

	async onload(){
		await this.loadSettings();


		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				createDailyNote(date)
			}
			
		});

	}

	async loadSettings() {
		this.settings = Object.assign({}, this.settings.OpenOnStart, await this.loadData());
	}
}