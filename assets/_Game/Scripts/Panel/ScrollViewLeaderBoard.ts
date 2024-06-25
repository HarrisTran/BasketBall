import { _decorator, clamp01, Component, instantiate, Layout, misc, Node, Prefab, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
import { ItemRow } from '../ItemRow';
const { ccclass, property } = _decorator;

@ccclass('ScrollViewLeaderBoard')
export class ScrollViewLeaderBoard extends Component {
    @property(ScrollView) scrollView: ScrollView = null;
    @property(Node) topItem: Node = null;
    @property(Node) bottomItem: Node = null;
    @property(SpriteFrame) playerFrame: SpriteFrame = null;

    delta : number = 0;
    playerIndex : number = -1;

    viewHeight: number = 0;

    lowerBound : number = 0;
    upperBound : number = 0;
    private _createCompleted: boolean = false;

    public createBoard(data: number[],playerIndex: number, playerScore: number, itemPrefab: Prefab){
        this.topItem.getComponent(ItemRow).createItemRow(playerIndex, playerScore);
        this.bottomItem.getComponent(ItemRow).createItemRow(playerIndex, playerScore);
        
        this.scrollView.content.removeAllChildren();
        let index : number = 1;
        for(let info of data){
            let item = instantiate(itemPrefab);
            this.scrollView.content.addChild(item);
            item.getComponent(ItemRow).createItemRow(index,info);
            if(index == playerIndex) item.getComponent(Sprite).spriteFrame = this.playerFrame;
            index++;
        }
        this.scrollView.content.getComponent(Layout).updateLayout();
        this.playerIndex = playerIndex;
        this._initializeBoundaries();
        
        this._createCompleted = true;
    }

    protected onDisable(): void {
        this._createCompleted = false;
    }

    private _initializeBoundaries(): void {
        this.viewHeight = this.node.getChildByName('view').getComponent(UITransform).height
        let halfHeightItem = this.scrollView.content.children[0].getComponent(UITransform).height/2;

        this.delta = this.scrollView.content.getComponent(UITransform).height - this.viewHeight;

        this.lowerBound = (-this.scrollView.content.children[this.playerIndex-1].position.y-this.viewHeight+halfHeightItem)/this.delta;
        this.upperBound = this.lowerBound + this.viewHeight/this.delta;
    }

    private _getRatio(){
        return clamp01(this.scrollView.content.getPosition().y/this.delta);
    }

    protected update(dt: number): void {
        if(this._createCompleted){
            this.topItem.active = false;
            this.bottomItem.active = false;
            if(this.lowerBound > this.viewHeight/this.delta) return;
            if (this._getRatio() > this.upperBound) {
                this.topItem.active = true;
            }
            else if (this._getRatio() < this.lowerBound) {
                this.bottomItem.active = true;
            }
        }
    }
}


