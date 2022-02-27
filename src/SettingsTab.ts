import MyTaskPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

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
			.setName('Create on Start')
			.setDesc('Create the Task Note on startup')

			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.OpenOnStart)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.OpenOnStart = value;
						this.plugin.saveSettings();
				}));
			
		new Setting(containerEl)
			.setName('Side Bar Button')
			.setDesc('Add a side bar button to open the Task Note')

			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.SideButton)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.SideButton = value;
						this.plugin.add_side_button();
						this.plugin.saveSettings();
				}));	
		
		new Setting(containerEl)
			.setName('Task Notification')
			.setDesc('Display a system notification when tasks are due')
			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.SendNotifs)
					.onChange( async (value: boolean) => {	
						this.plugin.settings.SendNotifs = value;
						this.plugin.saveSettings();
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
				.setDesc(`Date format for task due dates
Please use  either **DDMMYYYY, MMDDYYYY, YYYYMMDD or YYYYDDMM**`)
				.addText(text => text
					.setPlaceholder('Date')
					.setValue(this.plugin.settings.DateFormat)
					.onChange(async (value) => {
						this.plugin.settings.DateFormat = value;
						await this.plugin.saveSettings();
					}))
		
		new Setting(containerEl)
				.setName('File Date Format')
				.setDesc('Date format for file name prefix. This is different to task date format')
				.addText(text => text
					.setPlaceholder('Date')
					.setValue(this.plugin.settings.FileDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.FileDateFormat = value;
						await this.plugin.saveSettings();
					}))

		new Setting(containerEl)
		.setName('Usernames')
		.setDesc('Assign tasks to specific people if syncing the planner accross multiple accounts to only show notifications to the necessary people')
		.addToggle(toggle => 
			toggle
				.setValue(this.plugin.settings.Usernames)
				.onChange( async (value: boolean) => {	
					this.plugin.settings.Usernames = value;
					this.plugin.saveSettings();
			}));	
		
			
		new Setting(containerEl)
			.setName('Username')
			.setDesc('Username for this Task Planner user - Please do not use spaces')
			.addText(text => text
				.setPlaceholder('Username')
				.setValue(this.plugin.settings.Username)
				.onChange(async (value) => {
					this.plugin.settings.Username = value;
					await this.plugin.saveSettings();
				}));
   
			
		
		
	}
}