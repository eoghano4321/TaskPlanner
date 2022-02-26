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
		//let username_tab : any;
		
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
				.setDesc('Date format for task due dates. Dates in preexisting files need to be changed manually. Automatic date fixing coming soon')
				.addText(text => text
					.setPlaceholder('Date')
					.setValue(this.plugin.settings.DateFormat)
					.onChange(async (value) => {
						this.plugin.settings.DateFormat = value;
						await this.plugin.saveSettings();
					}))
		
		new Setting(containerEl)
				.setName('File Date Format')
				.setDesc('Date format for file name prefix. This is separate to task date format')
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
					//username_tab.setDisabled(value)
					this.plugin.saveSettings();
			}));	
		
			//if(this.plugin.settings.Usernames){
			new Setting(containerEl)
				.setName('Username')
				.setDesc('Username for this Task Planner user')
				.addText(text => text
					.setPlaceholder('Username')
					.setValue(this.plugin.settings.Username)
					.onChange(async (value) => {
						this.plugin.settings.Username = value;
						await this.plugin.saveSettings();
					}))
   
		   //}
			
		
		

		
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