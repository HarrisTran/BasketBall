import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemRow')
export class ItemRow extends Component {
    @property(Sprite)
    private medalSprite: Sprite = null;

    @property(Label)
    private index : Label = null;

    @property(Label)
    private scoreLabel : Label = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public goldMedal: SpriteFrame = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public silverMedal: SpriteFrame = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public bronzeMedal: SpriteFrame = null;

    public score : number;

    public createItemRow(rank: number, score: number){
        this.score = score;
        let spriteFrame : SpriteFrame = null;
        switch (rank) {
            case 1:
                spriteFrame = this.goldMedal;
                break;
            case 2:
                spriteFrame = this.silverMedal;
                break;
            case 3:
                spriteFrame = this.bronzeMedal;
                break;
            default:
                spriteFrame = null;
                break;
        }
        this.medalSprite.spriteFrame = spriteFrame;

        this.scoreLabel.string = score.toString();

        this.index.string = rank.toString();
    }
}


