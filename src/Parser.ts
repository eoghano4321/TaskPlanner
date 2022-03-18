import { App, Notice, normalizePath, Vault, moment, TFile } from "obsidian"
import MyTaskPlugin from "./main";
import {Notifications} from "./Notifs"
import { SETTINGS } from "./Settings";


export class Parser {
    notifications : Notifications;
    vault : Vault;
    settings : SETTINGS;
	act_tasks : number;
	urg_tasks : number;
	day_no : number;
	TaskPlugin : MyTaskPlugin;

    constructor(vault: Vault, settings : SETTINGS, plugin : MyTaskPlugin){
        this.vault = vault;
        this.settings = settings;
		this.TaskPlugin = plugin;
    }

	
    async update_act_tasks(){
		this.act_tasks = 0;
		this.urg_tasks = 0;
		let date_string : string;
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s)((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s.+$/gm);
		this.notifications = new Notifications(this.vault, this.settings);

		//const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);
		const task_file = this.vault.getAbstractFileByPath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`) as TFile;
		//this.vault.adapter.exists(normalizedFileName, false)
		
		if (this.vault.getFiles().contains(task_file)){
			let file_contents = (await this.vault.cachedRead(task_file)).match(Regex);

			if (!file_contents){
				new Notice("No Active Tasks : )") 
			}else{
				for (let i = 0; i <= file_contents.length; i++){
					let task_date = (file_contents[i].match(/\d+/g))

					if(this.settings.DateFormat = 'DDMMYYYY'){
						date_string = task_date[2] + task_date[1] + task_date[0]
					}else{
						if(this.settings.DateFormat = 'MMDDYYYY'){
							date_string = task_date[2] + task_date[0] + task_date[1]
						}else{
							if(this.settings.DateFormat = 'YYYYMMDD'){
								date_string = task_date[0] + task_date[1] + task_date[2]
							}else{
								if(this.settings.DateFormat = 'YYYYDDMM'){
									date_string = task_date[0] + task_date[2] + task_date[1]
								}else{
									date_string = task_date[2] + task_date[1] + task_date[0]
								}
							}
						}
					}
					let task_string = (await file_contents[i].match(/(?<=((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s)(.+(?:$))/))

					if(this.settings.Usernames && new RegExp(/\#/g).test(task_string[0])){
						if(new RegExp("(?<=\#)" + this.settings.Username).test(task_string[0])){
							if (new RegExp(/urgent/gi).test(task_string[0])){
								this.urg_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
								this.act_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
							}else{
								if (date_string == moment().format('YYYYMMDD')){
	
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
	
								}
								else{
									if (date_string <= moment().subtract(1, "days").format('YYYYMMDD')){
										this.act_tasks += 1;
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									}else{
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
										this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
									}
								}
							}
						}
					}else{
						if (new RegExp(/urgent/gi).test(task_string[0])){
							this.urg_tasks += 1;
							this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
							this.act_tasks += 1;
							this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
						}else{
							if (date_string == moment().format('YYYYMMDD')){

								this.act_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.act_tasks, false)

							}
							else{
								if (date_string <= moment().subtract(1, "days").format('YYYYMMDD')){
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
								}else{
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
								}
							}
						}
					}
				}

			}
		
		}

	}

	async parse_for_tasks(){
		this.act_tasks = 0;
		this.urg_tasks = 0;
		this.day_no = 1;
		let date_string : string;
		let neat_date_string : string;

		// Accounts for natural language date format
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s)((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s.+$/gm)
		this.notifications = new Notifications(this.vault, this.settings)
		
		while (this.day_no <= 7){
			//let yesterday_file  = normalizePath(this.settings.CustomFolder + `/` + moment().subtract(this.day_no, "days").format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);
			let yes_file = this.vault.getAbstractFileByPath(this.settings.CustomFolder + `/` + moment().subtract(this.day_no, "days").format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`) as TFile;
		
			//const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);
			const task_file = this.vault.getAbstractFileByPath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`) as TFile;

			let new_contents = `## Task Planner`

			if (this.vault.getFiles().contains(yes_file)){
				let file_contents = (await this.vault.cachedRead(yes_file)).match(Regex);
				
				if (!file_contents){
					
				}else{
					for (let i = 0; i <= file_contents.length; i++){
						let task_date = (file_contents[i].match(/\d+/g))

						if(this.settings.DateFormat = 'DDMMYYYY'){
							date_string = task_date[2] + task_date[1] + task_date[0]
						}else{
							if(this.settings.DateFormat = 'MMDDYYYY'){
								date_string = task_date[2] + task_date[0] + task_date[1]
							}else{
								if(this.settings.DateFormat = 'YYYYMMDD'){
									date_string = task_date[0] + task_date[1] + task_date[2]
								}else{
									if(this.settings.DateFormat = 'YYYYDDMM'){
										date_string = task_date[0] + task_date[2] + task_date[1]
									}else{
										date_string = task_date[2] + task_date[1] + task_date[0]
									}
								}
							}
						}
						neat_date_string = task_date[0] + '/' + task_date[1] + '/' + task_date[2]
						let task_string = (file_contents[i].match(/(?<=((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s)(.+(?:$))/))
					

						//Checks if the account has enabled usernames
						//If it has checks for #Username in the task string and only sends the notification if it is assigned to the person
						//If it has no # it sends the notification to everyone
						if(this.settings.Usernames && new RegExp(/\#/g).test(task_string[0])){
							if(new RegExp("(?<=\#)" + this.settings.Username).test(task_string[0])){
								if (new RegExp(/urgent/gi).test(task_string[0])){
									this.notifications.send_task_notif(task_string[0], "URGENT TASK (" + neat_date_string + "): ")
									this.urg_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
								}
								else{
									if (date_string == moment().format('YYYYMMDD')){
										this.notifications.send_task_notif(task_string[0], "TASK DUE TODAY (" + neat_date_string + "): " )
										
										this.act_tasks += 1;
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)

									}
									else{
										if (date_string <= moment().subtract(1, "days").format('YYYYMMDD')){
											this.notifications.send_task_notif(task_string[0], "TASK PAST DUE (" + neat_date_string + "): ")
											this.act_tasks += 1;
											this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
										}
									}
								}
							}

						}else{
							//If not using the usernames it sends a notification for everyone and sets the tasks as active
							if (new RegExp(/urgent/gi).test(task_string[0])){
								this.notifications.send_task_notif(task_string[0], "URGENT TASK (" + neat_date_string + "): ")
								this.urg_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
								this.act_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
							}
							else{
								if (date_string == moment().format("YYYYMMDD")){
									this.notifications.send_task_notif(task_string[0], "TASK DUE TODAY (" + neat_date_string + "): " )
									
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)

								}
								else{
									if (date_string <= moment().subtract(1, "days").format("YYYYMMDD")){
										this.notifications.send_task_notif(task_string[0], "TASK PAST DUE (" + neat_date_string + "): ")
										this.act_tasks += 1;
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									}
								}
							}
						}
						new_contents = new_contents + `
- [ ] `+ file_contents[i]

						this.vault.modify(task_file, new_contents)
						
					}
					
				}

				this.day_no += 8;
			} else{
				this.day_no ++;
			}
	
		}
	}

}