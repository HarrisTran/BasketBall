import { _decorator, Component } from 'cc';
import { GameplayPanel } from './Panel/GameplayPanel';
import { MainMenuPanel } from './Panel/MainMenuPanel';
import { GameOverPanel } from './Panel/GameOverPanel';
import { LoadingPanel } from './Panel/LoadingPanel';
const { ccclass, property } = _decorator;

@ccclass('UiController')
export class UiController extends Component {
    @property({group : {name : "UI", displayOrder: 2}, type: LoadingPanel})
    public loadingUI: LoadingPanel = null;
   
    @property({group : {name : "UI", displayOrder: 2}, type: MainMenuPanel})
    public startGameUI: MainMenuPanel = null;

    @property({group : {name : "UI", displayOrder: 2}, type: GameplayPanel})
    public gameplayUI: GameplayPanel = null;

    @property({group : {name : "UI", displayOrder: 2}, type: GameOverPanel})
    public endGameUI: GameOverPanel = null;

    onLoad(){
    }

    protected start(): void {
        this.loadingUI.node.active = true;
        this.startGameUI.node.active = false;
        this.gameplayUI.node.active = false;
        this.endGameUI.node.active = false;
    }

    // protected update(dt: number): void {
    //     if (GameManager.Instance.CurrentGameState != GameState.Playing) return;

    //     this._currentTime -= dt;
    //     this.timeTxt.string = FormatTime(this._currentTime);

    //     if (this._currentTime <= 0) {
    //         this.timeTxt.string = FormatTime(0);
    //         this.ShowEndGameUI();
    //     }
    // }
    public LoadingDone(){
        this.loadingUI.node.active = false;
        this.startGameUI.node.active = true;
        this.gameplayUI.node.active = false;
        this.endGameUI.node.active = false;

    }

    public StartGame(): void {
        this.loadingUI.node.active = false;
        this.startGameUI.node.active = false;
        this.gameplayUI.node.active = true;
        this.endGameUI.node.active = false;
    }

    public updateScore(){
        this.gameplayUI.updateScore();
    }
    

    public ShowEndGameUI(): void {
        this.loadingUI.node.active = false;
        this.startGameUI.node.active = false;
        this.gameplayUI.node.active = false;
        this.endGameUI.node.active = true;
        //this.endGameScoreTxt.string = "Your score: " + GameManager.Instance.score.toString();
    }
}