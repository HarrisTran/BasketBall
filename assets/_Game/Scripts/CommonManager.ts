import { _decorator, Component, Enum, ParticleSystem, Vec3, game, math, Node, Animation } from "cc";
import BEConnector from "./BEConnector";
import { GameState, ENUM_GAME_EVENT, ENUM_AUDIO_CLIP } from "./Enum";
import { IManager } from "./IManager";
import PoolManager from "./PoolManager";
import ResourceManager from "./ResourceManager";
import { SoundManager } from "./SoundManager";
import { Tutorial } from "./Tutorial";
import { UiController } from "./UiController";
import { playParticleRecursively } from "./Utilities";


const { ccclass, property } = _decorator;

window.addEventListener('message', (data) => {
    const { data: res } = data;
    const objectRes = JSON.parse(res);
    if (objectRes) {
        const { type, value } = objectRes;
        if (type === 'newTicket') {
            CommonManager.Instance.APIManager.numberTicket += value;
            CommonManager.Instance.ChangeState(GameState.Replay);
        }
    }
});
@ccclass('CommonManager')
export class CommonManager extends Component {
    private static _instance: CommonManager = null;
    public static get Instance(): CommonManager {
        return CommonManager._instance;
    }

    @property({ type: Enum(GameState) , visible : false})
    public CurrentGameState: GameState = GameState.MainMenu;

    @property([Node]) public SpawnBallPositions: Node[] = [];
    @property(UiController) public UiController: UiController = null;
    @property(SoundManager) public audioManager: SoundManager = null;
    @property(Node) private ballContainer: Node = null;
    @property(Node) private basketSpace: Node = null;
    @property(Node) private groundSpace: Node = null;
    @property(Tutorial) tutorial: Tutorial = null;
    @property(ParticleSystem) ballPassParticle: ParticleSystem = null;
    @property(ParticleSystem) ballHitParticle: ParticleSystem = null;
    @property(Animation) net1: Animation = null;
    @property(Animation) net2: Animation = null;


    private _score: number = 0;
    public replayed: boolean = false;

    // all managers
    private _allManagers : IManager[] = [];
    public APIManager: BEConnector;
    public resouceManager : ResourceManager;

    ////////////////////////////////////////////
    private _ballSpawnPosition: Vec3;

    protected onLoad(): void {
        CommonManager._instance = this;
        this._initializeGameEvent();
        this.ChangeState(GameState.Loading)
    }


    private _initializeAllManagers(): void {
        this._allManagers = [];

        this.APIManager = new BEConnector();
        this.resouceManager = new ResourceManager();

        this._allManagers.push(this.resouceManager);
        this._allManagers.push(this.audioManager);

        this.APIManager.initialize();

        this.resouceManager.initialize();
        this.audioManager.initialize();
    }

    private _initializeGameEvent() {
        game.on(ENUM_GAME_EVENT.SPAWN_NEW_BALL, this.SpawnBall, this);
        game.on(ENUM_GAME_EVENT.THROW_BALL,this.throwBall,this);
        game.on(ENUM_GAME_EVENT.START_GAME, this.StartGame, this);
        game.on(ENUM_GAME_EVENT.UPDATE_SCORE, this.updateScore, this);
        game.on(ENUM_GAME_EVENT.SHOW_TUTORIAL, this.showTutorial, this);
    }
    
    public basketSpaceTrigger(isActive: boolean) {
        this.basketSpace.active = isActive;
    }

    public groundSpaceTrigger(isActive: boolean){
        this.groundSpace.active = isActive;
    }

    public get score(){
        return this._score;
    }
    
    public ChangeState(newState: GameState) {
        if (this.CurrentGameState == newState) return;

        this.CurrentGameState = newState;  
        switch (this.CurrentGameState) {
            case GameState.Loading:
                this._initializeAllManagers();
                break;
            case GameState.MainMenu:
                this.UiController.LoadingDone();
                break;
            case GameState.Playing:
                this.APIManager.ticketMinus("auth");
                this.UiController.StartGame();
                break;
            case GameState.Replay:
                this.ballContainer.removeAllChildren();
                this.APIManager.ticketMinus("revive");
                this.UiController.StartGame();
                break;
            case GameState.EndGame:
                this.UiController.ShowEndGameUI();
                this.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_ENDGAME);
                break;
        }
    }

    public EndGame(): void {
        this.ChangeState(GameState.EndGame);
    }

    private StartGame(): void {
        
        this.ChangeState(GameState.Playing);
    }


    private SpawnBall(): void {
        
        this.basketSpaceTrigger(false);
        this.groundSpaceTrigger(false);

        let randomPositionIndex = math.randomRangeInt(0,this.SpawnBallPositions.length);
        if(this._score < 30) randomPositionIndex = 5;
        let getRandomPosition : Vec3 = this.SpawnBallPositions[randomPositionIndex].getWorldPosition();
        this._ballSpawnPosition = getRandomPosition.clone();

        PoolManager.instance.getNode("Ball",this.ballContainer,getRandomPosition.clone());
    }

    private updateScore() {
        if(this.CurrentGameState == GameState.Playing || this.CurrentGameState === GameState.Replay){
            this._score += 10;
            this.UiController.updateScore();
            this.APIManager.score = this._score;
            playParticleRecursively(this.ballPassParticle);
            this.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_SCORE);
            this.net1.play();
            this.net2.play();
        }
    }

    private showTutorial(){
        this.tutorial.playTutorial();
    }

    private throwBall(){
        this.ballHitParticle.node.setWorldPosition(new Vec3(this._ballSpawnPosition.x,this._ballSpawnPosition.y-100));
        playParticleRecursively(this.ballHitParticle);
        if(this.node.getChildByName("Tutorial")){
            this.node.getChildByName("Tutorial").removeFromParent();
        }
    }

    protected update(dt: number): void {
        if(this.CurrentGameState === GameState.Loading){
            let total = this._allManagers.reduce((acc, manager) =>{
                return acc + manager.progress();
            },0)
            this.UiController.loadingUI.setProgressBar(total/this._allManagers.length);
            if(this._allManagers.every(manager => manager.initializationCompleted()) && this.CurrentGameState === GameState.Loading){
                this.ChangeState(GameState.MainMenu);
            }
        }
    }
}