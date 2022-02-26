import { App, Notice, normalizePath, Vault, moment } from "obsidian"
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
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s)((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s.+$/gm);
		this.notifications = new Notifications(this.vault, this.settings);

		const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);

		if (await this.vault.adapter.exists(normalizedFileName, false)){
			let file_contents = (await this.vault.adapter.read(normalizedFileName)).match(Regex);

			if (!file_contents){
				new Notice("No Active Tasks : )") //TODO Make this the status bar string
			}else{
				for (let i = 0; i <= file_contents.length; i++){
					let task_date = (await file_contents[i].match(/\d+/g))
					let date_string = task_date[0] + task_date[1] + task_date[2]
					let task_string = (await file_contents[i].match(/(?<=((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s)(.+(?:$))/))

					if(this.settings.Usernames && new RegExp(/\#/g).test(task_string[0])){
						if(new RegExp("(?<=\#)" + this.settings.Username).test(task_string[0])){
							if (new RegExp(/urgent/gi).test(task_string[0])){
								this.urg_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.urg_tasks, true)
								this.act_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
							}else{
								if (date_string == moment().format(this.settings.DateFormat)){
	
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
	
								}
								else{
									if (date_string <= moment().subtract(1, "days").format(this.settings.DateFormat)){
										this.act_tasks += 1;
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
										//new Notice(String(this.act_tasks))
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
							if (date_string == moment().format(this.settings.DateFormat)){

								this.act_tasks += 1;
								this.TaskPlugin.calc_act_tasks(this.act_tasks, false)

							}
							else{
								if (date_string <= moment().subtract(1, "days").format(this.settings.DateFormat)){
									this.act_tasks += 1;
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									//new Notice(String(this.act_tasks))
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

		// Accounts for natural language date format
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s)((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s.+$/gm)
		this.notifications = new Notifications(this.vault, this.settings)
		
		while (this.day_no <= 7){
			let yesterday_file  = normalizePath(this.settings.CustomFolder + `/` + moment().subtract(this.day_no, "days").format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);
		
		
			const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.FileDateFormat) + `-` + this.settings.CustomFile + `.md`);

			let new_contents = `## Task Planner`

			if (await this.vault.adapter.exists(yesterday_file, false)){
				let file_contents = (await this.vault.adapter.read(yesterday_file)).match(Regex);
				//let date_match = (await this.vault.adapter.read(yesterday_file)).split(/(\-|\/)/)
				//let date_string: string = (date_match[0] + date_match[1] + date_match[2])
				//let extracted_dates = date_string.match(/\d+/)
				//	let file_array : any
				//let date_match = (await this.vault.adapter.read(yesterday_file)).match(RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/))
				// let file_contents = (await this.vault.adapter.read(normalizedFileName))   //.search(/\-\s\[\s\]/g)         //await this.vault.adapter.read(normalizedFileName)).replace(/\-\s\[\s\]/g, '- [x]');
				if (!file_contents){
					new Notice("No Tasks in previous note: " + moment().subtract(this.day_no, "days").format(this.settings.DateFormat))
				}else{
					// this.notifications.send_notif("THERE ARE TASKS" + file_contents[0])
					for (let i = 0; i <= file_contents.length; i++){
						let task_date = (await file_contents[i].match(/\d+/g))
						let date_string = task_date[0] + task_date[1] + task_date[2]
						let neat_date_string = task_date[0] + '/' + task_date[1] + '/' + task_date[2]
						let task_string = (await file_contents[i].match(/(?<=((\d+(\-|\/)\d+(\-|\/)\d+)|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\]\])|(\[\[\d+(\-|\/)\d+(\-|\/)\d+\|\w+\]\]))\s)(.+(?:$))/))
					

						//if (date_string != moment().format(this.settings.DateFormat)){
						//	new Notice("No date" +date_string)//(date_match[0])
						//}

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
									if (date_string == moment().format(this.settings.DateFormat)){
										this.notifications.send_task_notif(task_string[0], "TASK DUE TODAY (" + neat_date_string + "): " )
										
										this.act_tasks += 1;
										//this.TaskPlugin.act_tasks += 1;
										//this.notifications.send_notif(String(this.TaskPlugin.act_tasks) + "HEHEH")
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
										//new Notice("Date" + date_string)//(date_match[0])
									}
									else{
										if (date_string <= moment().subtract(1, "days").format(this.settings.DateFormat)){
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
								if (date_string == moment().format(this.settings.DateFormat)){
									this.notifications.send_task_notif(task_string[0], "TASK DUE TODAY (" + neat_date_string + "): " )
									
									this.act_tasks += 1;
									//this.TaskPlugin.act_tasks += 1;
									//this.notifications.send_notif(String(this.TaskPlugin.act_tasks) + "HEHEH")
									this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									//new Notice("Date" + date_string)//(date_match[0])
								}
								else{
									if (date_string <= moment().subtract(1, "days").format(this.settings.DateFormat)){
										this.notifications.send_task_notif(task_string[0], "TASK PAST DUE (" + neat_date_string + "): ")
										this.act_tasks += 1;
										this.TaskPlugin.calc_act_tasks(this.act_tasks, false)
									}
								}
							}
						}
						new_contents = new_contents + `
- [ ] `+ file_contents[i]
						//this.notifications.send_notif(new_contents)
						this.vault.adapter.write(normalizedFileName, new_contents)
					}
					
				}

				this.day_no += 8;
			} else{
				this.day_no ++;
			}
	
		}
	}

}