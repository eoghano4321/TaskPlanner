import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {TASK_SETTINGS} from "./Settings";

export const NAME: string = "Eoghan";

console.log(TASK_SETTINGS);

export default class MyPlugin extends Plugin {
	settings: typeof TASK_SETTINGS;
}