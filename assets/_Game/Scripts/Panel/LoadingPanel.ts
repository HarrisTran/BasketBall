import { _decorator, clamp01, Component, Node, ProgressBar, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingPanel')
export class LoadingPanel extends Component {
    @property(ProgressBar)
    loadingProgress: ProgressBar = null;

    @property(Animation)
    textAnimation: Animation = null;

    protected onEnable(): void {
        this.textAnimation.play();
    }

    public setProgressBar(value : number){
        value = clamp01(value);
        this.loadingProgress.progress = value;
    }

    onDisable(){
        this.textAnimation.stop();
    }
}


