import { App, Notice, normalizePath, Vault, moment } from "obsidian"
import {Notifications} from "./Notifs"
import { SETTINGS } from "./Settings";


export class Parser {
    notifications : Notifications;
    vault : Vault;
    settings : SETTINGS;

    constructor(vault: Vault, settings : SETTINGS){
        this.vault = vault;
        this.settings = settings
    }

	
    //ToDO Add task and date to todays file properly. Add ability to transfer more than 1 task

	async parse_for_tasks(){
		
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s)\d+(\-|\/)\d+(\-|\/)\d+\s(\w+(\s|$))+$/gm)
		this.notifications = new Notifications(this.vault)
		//this.notifications.send_notif("HELPME")
		const yesterday_file  = normalizePath(this.settings.CustomFolder + `/` + moment().subtract(1, "days").format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);
		const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);

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
				this.notifications.send_notif("No Tasks in yesterdays note")
			}else{
				this.notifications.send_notif("THERE ARE TASKS" + file_contents[0])
				for (let i = 0; i <= file_contents.length; i++){
					let task_date = (await file_contents[i].match(/\d+/g))
					let date_string = task_date[0] + task_date[1] + task_date[2]
					let task_string = (await file_contents[i].match(/(?<=\d+(\-|\/)\d+(\-|\/)\d+\s)(\w+(\s|(?:$)))+(?:$)/))
					//for  (let k = 0; i <= task_date.length; k++){
				//		task_date
				//	
				//	}
				

					if (date_string != moment().format(this.settings.DateFormat)){
						new Notice("No date" +date_string)//(date_match[0])
					}
					if (date_string == moment().format(this.settings.DateFormat)){
						this.notifications.send_notif("TASK DUE TODAY (" + date_string + "): " + task_string[0])
						new Notice("Date" + date_string)//(date_match[0])
					}

					new_contents = new_contents + `
- [ ] `+ file_contents[i]
					this.notifications.send_notif(new_contents)
					this.vault.adapter.write(normalizedFileName, new_contents)
				}
				
			}
			// 	for (let j = 0; j <= file_contents.length; j++){
			// 	//	file_array.append(file_contents[j] + ")
			
					
				
			// 	}// normalizedFileName.
			// }
		} else{
			//new Notice("No File Exists")
            this.notifications.send_notif("No File Exists");
		}
		

	}

}