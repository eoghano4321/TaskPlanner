import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

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

export default class MyPlugin extends Plugin {
	settings = DefaultPluginSettings;

	async onload(){
		await this.loadSettings();

	}


	async loadSettings() {
		this.settings = Object.assign({}, this.settings.OpenOnStart, await this.loadData());
	}
}