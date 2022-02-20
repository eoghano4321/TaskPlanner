import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent, Vault, normalizePath, moment, WorkspaceLeaf } from 'obsidian';
import type {Moment, WeekSpec } from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';

import {FileCreator} from "./CreateTaskNote"
import {Notifications} from './Notifs';
import {SETTINGS} from "./Settings";
import { SettingTab } from './SettingsTab';
import TaskView from './Taskview';
import { Parser } from './Parser';
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
	status_bar : HTMLElement | undefined = undefined;
	urg_status_bar : HTMLElement | undefined = undefined;
	filecreator : FileCreator;
	notifications : Notifications;
	act_tasks : number;
	urg_tasks : number;
	task_view : TaskView;
	parser : Parser;
	

	async loadSettings() {
		// this.settings = Object.assign({}, this.settings, await this.loadData());
		this.settings = Object.assign(new SETTINGS(), await this.loadData());
		//this.add_side_button();
	}

	

	async onload(){
		this.act_tasks = 0;
		this.urg_tasks = 0;
		await this.loadSettings();
		this.add_side_button();
		
		this.vault = this.app.vault;
		this.notifications = new Notifications(this.vault, this.settings);
		this.filecreator = new FileCreator(this.vault, this.app, this.settings, this)

		// const normalizedPath = normalizePath(`'Task'`);
		// const FileExists = await this.vault.adapter.exists(normalizedPath, false);

		// this.notifications.send_notif(`${this.settings.OpenOnStart}, ${this.settings.SideButton}, ${this.settings.CustomFolder}, ${this.settings.DateFormat}`)

		this.addSettingTab(new SettingTab(this.app, this));
		this.calc_act_tasks(this.act_tasks, false);
		this.calc_act_tasks(this.urg_tasks, true)

		if (this.settings.OpenOnStart){
			await this.app.workspace.onLayoutReady;
			await this.filecreator.open_note();
		}

		this.parser = new Parser(this.vault, this.settings, this)
		this.parser.update_act_tasks()

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
				//this.notifications.send_notif(String(this.act_tasks));
				
				// if (!FileExists){
				// 	this.vault.create(normalizedPath, `## TASKKKKKS`);
				// 	this.send_notif('File Created ');

				// }


			}

		});

		this.registerView('taskview', (leaf : WorkspaceLeaf) => (this.task_view = new TaskView(leaf, this.settings)))

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			if (this.app.workspace.getActiveFile.toString() == this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`){
				new Notice(this.app.workspace.getActiveFile.name );
			}
		});

		this.registerInterval(window.setInterval(async () => {
			this.parser.update_act_tasks();
			
		}, 4000));
		

	}

	

	async saveSettings(){
		await this.saveData(this.settings);

	}

	

	

	public add_side_button(){
		this.ribbonIconEl?.remove();
		if (this.settings.SideButton ){	
			this.ribbonIconEl = this.addRibbonIcon('checkmark', 'Open Task Planner', (evt: MouseEvent) => {
				// Called when the user clicks the icon.
			//	new Notice('Plugin clicked!');
				new Notice('opening file')
				this.filecreator.open_note(this.settings.CustomFile);
			});
		}

	}


	
	async calc_act_tasks(active_tasks : number, is_urgent: boolean){
		if(is_urgent){
			this.urg_tasks = active_tasks
			this.urg_status_bar?.remove();
			this.urg_status_bar = this.addStatusBarItem()
			this.urg_status_bar.onClickEvent((evt: MouseEvent) => {
				this.filecreator.open_note(this.settings.CustomFile)
			})
			this.urg_status_bar.setText(String(this.urg_tasks) + ' Active Urgent Tasks')
		}else{
			this.act_tasks = active_tasks
			//this.notifications.send_notif(String(this.act_tasks) + "HO")
			this.status_bar?.remove();
			this.status_bar = this.addStatusBarItem()
			this.status_bar.onClickEvent((evt: MouseEvent) => {
				this.filecreator.open_note(this.settings.CustomFile);
			})
			this.status_bar.setText(String(this.act_tasks) + ' Active Tasks')
		}
	}

	
}





