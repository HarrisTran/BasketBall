import { _decorator, Component, Label, game,Node,Animation } from "cc";
import { ENUM_GAME_EVENT, ENUM_AUDIO_CLIP, GameState } from "../Enum";
import { delay, FormatTime } from "../Utilities";
import { CommonManager } from "../CommonManager";

;
const { ccclass, property } = _decorator;

@ccclass('GameplayPanel')
export class GameplayPanel extends Component {
    @property(Label)
    private timeTxt: Label = null;

    @property(Label)
    private scoreTxt: Label = null;

    @property(Node)
    private soundButton: Node = null;

    @property(Animation)
    private floatScoreAnimation: Animation = null;

    @property(Label)
    private countDownTimer: Label = null;

    

    private _currentTime: number;
    private _isReady: boolean;

    private _alertTurnOn : boolean;


    protected onLoad(): void {
        this.soundButton.on('click', this._onCheckAudio);
    }

    protected async onEnable() {
        //this.timeTxt.node.getComponent(Animation).stop();
        this._currentTime = 60;
        this._isReady = false;
        this._alertTurnOn = false;
        this.countDownTimer.node.active = true;
        this.countDownTimer.string = '3'
        
        await delay(1);
        this.countDownTimer.string = '2'
        
        await delay(1);
        this.countDownTimer.string = '1'
        
        await delay(1);
        this._whenTimerCompleted();
        
        // await delay(this._currentTime - 4);
        // this.timeTxt.node.getComponent(Animation).play();
        // GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_TIMEUP);

    }

    private _whenTimerCompleted() {
        this._isReady = true;
        this.countDownTimer.node.active = false;
        game.emit(ENUM_GAME_EVENT.SPAWN_NEW_BALL); 
        game.emit(ENUM_GAME_EVENT.SHOW_TUTORIAL);
        CommonManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_START);
    }

    private _onCheckAudio() {
        CommonManager.Instance.audioManager.toggleMute();
    }

    public updateScore() {
        this.floatScoreAnimation.node.active = true;
        this.floatScoreAnimation.play();

        this.scoreTxt.string = (CommonManager.Instance.score).toString();
    }


    protected update(deltaTime: number) 
    {
        if ((CommonManager.Instance.CurrentGameState === GameState.Playing || CommonManager.Instance.CurrentGameState === GameState.Replay) && this._isReady) {
            this._currentTime -= deltaTime;
            this.timeTxt.string = FormatTime(this._currentTime);

            if (this._currentTime <= 0) {
                this.timeTxt.string = FormatTime(0);
                CommonManager.Instance.ChangeState(GameState.EndGame);
            }

            if(this._currentTime <= 3 && !this._alertTurnOn){
                //this.timeTxt.node.getComponent(Animation).play();
                //GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_TIMEUP);
                this._alertTurnOn = true;
            }
        }

    }
}


