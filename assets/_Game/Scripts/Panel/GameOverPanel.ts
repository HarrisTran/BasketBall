import { _decorator, Component, Label, Prefab, SpriteFrame, v3, tween,Node } from "cc";
import { GameState } from "../Enum";
import { ScrollViewLeaderBoard } from "./ScrollViewLeaderBoard";
import { CommonManager } from "../CommonManager";

const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {
    @property(Node) private panel: Node = null;
    @property(Label) private ticketMinus : Label = null;
    @property(ScrollViewLeaderBoard) private leaderBoardView : ScrollViewLeaderBoard = null;
    @property(Node) private continueButton : Node = null;
    @property(Prefab) private itemRowPrefab : Prefab = null;
    @property(SpriteFrame) playerFrame: SpriteFrame = null;
    @property(Node) txtLoading: Node = null;

    private _clickedContinueButton : boolean = false;
    private _clickedQuitGameButton: boolean = false;

    public showPopup(){
        this.node.active = true;
        this.panel.setScale(v3(0));
        tween(this.panel).delay(0.5).to(0.5,{scale: v3(1)},{easing: "backOut"}).start();
    }

    private exitGame(){
        CommonManager.Instance.APIManager.postScoreToServer();
        CommonManager.Instance.APIManager.postScoreWebEvent();
    }

    protected onEnable() {
        const numTicket = CommonManager.Instance.APIManager.getTicketCanBeMinus();
        this.ticketMinus.string = '-' + numTicket.toString();
        this.scheduleOnce(this.exitGame,60);
        this._updateLeaderBoard();
        
    }

    private async _updateLeaderBoard(){
        this.txtLoading.active = true;
        let userId = CommonManager.Instance.APIManager.userId;
        
        let participants = await CommonManager.Instance.APIManager.getLeaderboardInGame();
        
        let player = participants.find(user => user.userid == userId);

        if(!player) {
            participants.push({userid: userId,score: 0})
        }
        player = participants.find(user => user.userid == userId);
       
        player.score += CommonManager.Instance.score
        participants = participants.sort((a,b)=> b.score - a.score);

        let indexAfterSort = participants.findIndex(participant => participant.userid == userId);
        
        this.txtLoading.active = false;

        this.leaderBoardView.createBoard(participants.map(participant =>participant.score),indexAfterSort+1,player.score,this.itemRowPrefab)
    }

    private onClickContinue(){
        if(this._clickedContinueButton) return;
        this._clickedContinueButton = true;
        if(CommonManager.Instance.APIManager.canRelive()){
            CommonManager.Instance.APIManager
                .checkGameScoreTicket()
                .then(() => {
                    this._clickedContinueButton = false;
                    CommonManager.Instance.ChangeState(GameState.Replay);
                    this.continueButton.active = false;
                }) 
                .catch(()=>{
                    this._clickedContinueButton = false;
                    CommonManager.Instance.ChangeState(GameState.EndGame);
                })
        }else{
            this._clickedContinueButton = false;
            CommonManager.Instance.APIManager.postMessage();
        }

    }

    protected onDisable(): void {
        this.unschedule(this.exitGame);
    }


    onClickQuitGame(){
        if(!this._clickedQuitGameButton){
            this._clickedQuitGameButton = true;
            this.exitGame();
        }
    }


}


