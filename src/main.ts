import { FileView, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ToggleComponent, Vault, normalizePath, moment } from 'obsidian';
import type {Moment, WeekSpec } from 'moment';
import { createDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';


import {SETTINGS} from "./Settings";
// import { text } from 'stream/consumers';
// import { send } from 'process';
// TODO - Add the ability to change those settings in the settings tab & have those values saved


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
	vault : Vault = this.app.vault;
	settings: SETTINGS;
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

		this.send_notif(`${this.settings.OpenOnStart}, ${this.settings.SideButton}, ${this.settings.CustomFolder}, ${this.settings.DateFormat}`)

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
				this.createFileIfNotExists(this.settings.CustomFile);
				
				
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
			new Notification(`Test Notif`, { body: message, requireInteraction: true });
			
		}
	}

	async createFileIfNotExists(fileName: string) {
		await this.createFolderIfNotExists(this.settings.CustomFolder)
        try {
			
            const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + fileName + `.md`);
            if (!await this.vault.adapter.exists(normalizedFileName, false)) {
                await this.vault.create(normalizedFileName, `## TAslks
- [ ] Testing
- [ ] 
- [ ] 
- [ ] `);
				this.send_notif(normalizedFileName)
				this.open_note(this.settings.CustomFile)
				this.parse_for_tasks()
            }
			else{
				this.send_notif(`File ${normalizedFileName} already exists`, true)
			}
        } catch (error) {
            this.send_notif(`Error ${error}`)
        }
    }

	async createFolderIfNotExists(folderName: string){
		try {
            const normalizedPath = normalizePath(folderName);
            const folderExists = await this.vault.adapter.exists(normalizedPath, false)
            if(!folderExists) {
              await this.vault.createFolder(normalizedPath);
            }
        } catch (error) {
            new Notice(error)
        }

	}

	public add_side_button(){
		if (this.settings.SideButton ){
			this.ribbonIconEl?.remove();
			this.ribbonIconEl = this.addRibbonIcon('crossed-star', 'Open Task Planner', (evt: MouseEvent) => {
				// Called when the user clicks the icon.
			//	new Notice('Plugin clicked!');
				new Notice('opening file', 0.2)
				this.open_note(this.settings.CustomFile);
			});
		}


	}

	async open_note(note: string = `Task_Planner`){
		try{
			if (await this.vault.adapter.exists(await normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + note + `.md`), false)) {
				new Notice('File exists ... opening')
				await this.app.workspace.openLinkText(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + note + `.md`, '', true, {
					active: true,
				});
			}
			else{
				new Notice('File doesn\'t exist .... Creating file')
				this.createFileIfNotExists(note)
			}
		} catch (error){
			this.send_notif(`Error ${error}`);
			
		}
	}

	async parse_for_tasks(){
		let Regex : RegExp = RegExp(/\-\s\[\s\]\s+[^\-\d]*[\d]/)///\w+\s/)//"^\\s+[A-Za-z]+[.?!]$")

		this.send_notif()
		const yesterday_file  = normalizePath(this.settings.CustomFolder + `/` + moment().subtract(2, "days").format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);
		const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);
		if (await this.vault.adapter.exists(yesterday_file, false)){
			// this.send_notif()
			// normalizedFileName.search('-[ ]')
			let file_contents = (await this.vault.adapter.read(yesterday_file)).match(Regex);
			let date_match = (await this.vault.adapter.read(yesterday_file)).split(/\//)
			let date_string: string = (date_match[0] + date_match[1] + date_match[2])
			let extracted_dates = date_string.match(/\d+/)
			//let date_match = (await this.vault.adapter.read(yesterday_file)).match(RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/))
			// let file_contents = (await this.vault.adapter.read(normalizedFileName))   //.search(/\-\s\[\s\]/g)         //await this.vault.adapter.read(normalizedFileName)).replace(/\-\s\[\s\]/g, '- [x]');
			if (!file_contents){
				new Notice("No Tasks in yesterdays note")
			}else{
				if (extracted_dates[0] != moment().format(this.settings.DateFormat)){
					new Notice("No date" + extracted_dates[0])//(date_match[0])
				}
				if (extracted_dates[0] == moment().format(this.settings.DateFormat)){
					this.send_notif("TASK DUE TODAY: ")
					new Notice("Date" + extracted_dates[0])//(date_match[0])
				}
				
				for (let j = 0; j <= file_contents.length; j++){
					this.vault.adapter.write(normalizedFileName, file_contents[j])
					
				
				}// normalizedFileName.
			}
		} else{
			new Notice("No File Exists")
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