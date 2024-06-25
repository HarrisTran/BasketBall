import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property(Animation) pointer: Animation = null;

    public playTutorial(): void {
        this.node.active = true;
        this.pointer.play();
    }
    
}


