import { _decorator, Component, Node } from 'cc';
import { CommonManager } from '../CommonManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenuPanel')
export class MainMenuPanel extends Component {
    
    protected start(): void {
        CommonManager.Instance.audioManager.playBGM();
    }

}


