import { ParticleSystem } from "cc";

export function FormatTime(time: number): string {
    var minute = 0;
    var second = 0;
    var minuteString = "";
    var secondString = "";

    minute = time / 60;
    second = time % 60;

    if (minute < 10)
        minuteString = "0" + Math.floor(minute).toFixed();
    else minuteString = Math.floor(minute).toFixed();

    if (second < 10)
        secondString = "0" + Math.floor(second).toFixed();
    else secondString = Math.floor(second).toFixed();

    return minuteString + ":" + secondString;
}

export function delay(time: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

export function playParticleRecursively(parent: ParticleSystem){
    let childNodeParticle = parent.node.children.map(child=>child.getComponent(ParticleSystem));
    parent.play();
    for(let particle of childNodeParticle){
        particle.play();
    }
}


