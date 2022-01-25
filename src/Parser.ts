import { App, Notice, normalizePath, Vault, moment } from "obsidian"
import { Notifications } from "./Notifs"
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
		let Regex : RegExp = RegExp(/(?<=^\-\s\[\s\]\s\d+\-\d+\-\d+\s)(\w+(\s|$))+$/gm) // /\-\s\[\s\]\s+[^\-\d]*[\d]/)///\w+\s/)//"^\\s+[A-Za-z]+[.?!]$")
		

		this.notifications.send_notif()
		const yesterday_file  = normalizePath(this.settings.CustomFolder + `/` + moment().subtract(5, "days").format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);
		const normalizedFileName = normalizePath(this.settings.CustomFolder + `/` + moment(new Date()).format(this.settings.DateFormat) + `-` + this.settings.CustomFile + `.md`);
		if (await this.vault.adapter.exists(yesterday_file, false)){
			// this.send_notif()
			// normalizedFileName.search('-[ ]')
			let file_contents = (await this.vault.adapter.read(yesterday_file)).match(Regex);
			let date_match = (await this.vault.adapter.read(yesterday_file)).split(/(\-|\/)/)
			let date_string: string = (date_match[0] + date_match[1] + date_match[2])
			let extracted_dates = date_string.match(/\d+/)
		//	let file_array : any
			//let date_match = (await this.vault.adapter.read(yesterday_file)).match(RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/))
			// let file_contents = (await this.vault.adapter.read(normalizedFileName))   //.search(/\-\s\[\s\]/g)         //await this.vault.adapter.read(normalizedFileName)).replace(/\-\s\[\s\]/g, '- [x]');
			if (!file_contents){
				new Notice("No Tasks in yesterdays note")
			}else{
				if (extracted_dates[0] != moment().format(this.settings.DateFormat)){
					new Notice("No date" + extracted_dates[0])//(date_match[0])
				}
				if (extracted_dates[0] == moment().format(this.settings.DateFormat)){
					this.notifications.send_notif("TASK DUE TODAY: ")
					new Notice("Date" + extracted_dates[0])//(date_match[0])
				}
				
				for (let j = 0; j <= file_contents.length; j++){
				//	file_array.append(file_contents[j] + ")
					this.vault.adapter.write(normalizedFileName, file_contents[j])
					
				
				}// normalizedFileName.
			}
		} else{
			new Notice("No File Exists")
            this.notifications.send_notif();
		}
		
	}

}