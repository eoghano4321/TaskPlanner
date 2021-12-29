import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {SETTINGS} from "./Settings";

export const NAME: string = "Eoghan";


const PluginSettings: SETTINGS = {
	OpenOnStart : true,
	SideButton : true,
	SendNotifs : true,
	StatusBar : true
}

export default class MyPlugin extends Plugin {
	settings = PluginSettings;

	async onload(){
		await this.loadSettings();


	}


	async loadSettings() {
		this.settings = Object.assign({}, PluginSettings.OpenOnStart, await this.loadData());
	}
}