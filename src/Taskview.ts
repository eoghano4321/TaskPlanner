import { ItemView, WorkspaceLeaf } from "obsidian";
import { SETTINGS } from "./Settings";

export default class TaskView extends ItemView{
    settings : SETTINGS;

    constructor(leaf: WorkspaceLeaf, settings: SETTINGS){
        super(leaf);
        this.settings = settings;
    }

    getViewType(): string {
        return 'taskview';
    }

    getDisplayText(): string {
        return 'Task Planner';
    }

    getIcon(): string {
        return 'crossed-star'
    }

}