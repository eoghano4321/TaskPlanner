import { App, Editor} from 'obsidian'

export class SETTINGS {
    OpenOnStart: boolean = false;
    SideButton: boolean = false;
    SendNotifs: boolean = false;
    CustomFolder: string = 'TaskPlanners';
    CustomFile: string = 'Task_Planner';
    DateFormat: string = "DDMMYY";
    StatusBar: boolean = false;
}