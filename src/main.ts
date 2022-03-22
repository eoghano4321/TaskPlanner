import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TAbstractFile, ToggleComponent, Vault, normalizePath, moment, Workspace, debounce } from 'obsidian';
import type {Moment, WeekSpec } from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';

import {FileCreator} from "./CreateTaskNote"
import {Notifications} from './Notifs';
import {SETTINGS} from "./Settings";
import { TaskSettingTab } from './SettingsTab';
import TaskView from './Taskview';
import { Parser } from './Parser';



// This was removed from package.json as it was causing an issue with tsconfig
// "@types/node": "^16.11.6",

let date: Moment;
 



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
	task_workspace : Workspace;
	file : TFile;
	task_file : string

	async loadSettings() {
		this.settings = Object.assign(new SETTINGS(), await this.loadData());
	}

	update_tasks = debounce(() => {
		this.parser.update_act_tasks();
	}, 3000);

	async onload(){
		this.act_tasks = 0;
		this.urg_tasks = 0;
		await this.loadSettings();
		this.add_side_button();
		this.vault = this.app.vault;
		this.notifications = new Notifications(this.vault, this.settings);
		this.filecreator = new FileCreator(this.vault, this.app, this.settings, this)
		this.task_workspace = this.app.workspace;
		this.task_file = this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + `Task_Planner` + `.md`
		
		this.addSettingTab(new TaskSettingTab(this.app, this));

		

		this.task_workspace.onLayoutReady(() => {
			if (this.settings.OpenOnStart){
				this.filecreator.createFileIfNotExists('Task_Planner');
			}
			
		})
		
	
		
		
		this.parser = new Parser(this.vault, this.settings, this)
		this.parser.update_act_tasks()

		
		this.addCommand({
			id: 'open_task_planner',
			name: 'Open Task Planner Note',
			callback: () => {
				
				this.filecreator.open_note()
			}	
		});

		
		this.addCommand({
			id: 'create_task_note',
			name: 'Create a Task Planner Note',
			callback: () => {
				this.filecreator.createFileIfNotExists(this.settings.CustomFile);
				


			}

		});

		
		// if(this.vault.getAbstractFileByPath(this.task_file) instanceof TFile){
			
			// if((this.task_file) == this.task_workspace.getActiveFile().path){
		this.registerEvent(this.vault.on("modify",  (abstract_file: TAbstractFile) => {
			if(abstract_file == this.vault.getAbstractFileByPath(this.task_file)){
				this.update_tasks(); 
			}
		}))
				
			
	}



	
	

	async saveSettings(){
		await this.saveData(this.settings);

	}



	

	public add_side_button(){
		this.ribbonIconEl?.remove();
		if (this.settings.SideButton ){	
			this.ribbonIconEl = this.addRibbonIcon('lucide-list-checks', 'Open Task Planner', (evt: MouseEvent) => {
				// Called when the user clicks the icon.

				this.filecreator.open_note(this.task_file);
			});
		}

	}


	
	async calc_act_tasks(active_tasks : number, is_urgent: boolean){
		if(is_urgent){
			this.urg_tasks = active_tasks
			this.urg_status_bar?.remove();
			this.urg_status_bar = this.addStatusBarItem()
			this.urg_status_bar.onClickEvent((evt: MouseEvent) => {
				this.filecreator.open_note(this.task_file)
			})
			if(this.urg_tasks == 0){
				this.urg_status_bar.setText('No Urgent Tasks : )')
			}else{
				if(this.urg_tasks == 1){
					this.urg_status_bar.setText(String(this.urg_tasks) + ' Active Urgent Task')
				}else{
					this.urg_status_bar.setText(String(this.urg_tasks) + ' Active Urgent Tasks')
				}
			}
			
		}else{
			this.act_tasks = active_tasks;
			this.status_bar?.remove();
			this.status_bar = this.addStatusBarItem()
			this.status_bar.onClickEvent((evt: MouseEvent) => {
				this.filecreator.open_note(this.settings.CustomFile);
			})
			if(this.act_tasks == 0){
				this.status_bar.setText('No Active Tasks : )')
			}else{
				if(this.act_tasks == 1){
					this.status_bar.setText(String(this.act_tasks) + ' Active Task')
				}else{
					this.status_bar.setText(String(this.act_tasks) + ' Active Tasks')
				}
			}
			
		}
	}

	
}





