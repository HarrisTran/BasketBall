import { _decorator, assetManager, AudioClip, AudioSource, Component, director,  Sprite, SpriteFrame } from 'cc';
import { IManager } from './IManager';
import { ENUM_AUDIO_CLIP, SCENE_TO_RESOURCES_MAPPING } from './Enum';
const { ccclass, property } = _decorator;


@ccclass('SoundManager')
export class SoundManager extends Component implements IManager {
    private static readonly AUDIO_PATH: string = "Audio";

    @property(AudioSource)
    private soundSource: AudioSource = null;

    @property(AudioSource)
    private musicSource: AudioSource = null;
    
    @property(Sprite)
    soundSymbol: Sprite = null;

    @property(SpriteFrame)
    soundOn: SpriteFrame = null;

    @property(SpriteFrame)
    soundOff: SpriteFrame = null;


    private _audioClipSet: { [key: string]: AudioClip } = {};

    private _loadAudioProgress: number;
    private _loadAudioDone: boolean;

    private _isMute = false;
    
    initialize() {
        this._loadAudioProgress = 0;
        this._loadAudioDone = false;
        assetManager.loadBundle(SCENE_TO_RESOURCES_MAPPING[director.getScene().name], (error, bundle) => {
            bundle.loadDir(SoundManager.AUDIO_PATH, AudioClip,
                (finish,total,item)=>{
                    this._loadAudioProgress = finish/total;
                }
                ,
                (err,assets) => {
                    if(err) console.error(err);
                    let asset : any;
                    for(let i=0; i< assets.length; i++){
                        asset = assets[i];
                        this._audioClipSet[asset.name] = asset;
                    }
                }
            )
        })
        this._loadAudioProgress = 1;
        this._loadAudioDone = true;

        this._isMute = false;
    }

    progress(): number {
        let arr: number[] = [
            this._loadAudioProgress
        ];
        return arr.reduce((t, curr) => t + curr, 0) / arr.length;
    }

    initializationCompleted(): boolean {
        let arr: boolean[] = [
            this._loadAudioDone
        ];
        return arr.every(x => x);
    }

    public toggleMute(): boolean {
        this._isMute = !this._isMute;
        this.soundSymbol.spriteFrame = this._isMute ? this.soundOff : this.soundOn;
        this.setMute(this._isMute);
        return this._isMute;
    }

    public setMute(mute: boolean) {
        this._isMute = mute;
        if(this.soundSource.clip){
            this.soundSource.volume = mute ? 0 : 1;
        }
        if(this.musicSource.clip){
            this.musicSource.volume = mute ? 0 : 1;
        }
    }

    public playBGM(volume = 1, loop = true) {
        this.musicSource.stop();
        this.musicSource.clip = this._audioClipSet[ENUM_AUDIO_CLIP.BGM];
        this.musicSource.play();
    }

    public playSfx(audioClipName: ENUM_AUDIO_CLIP, volume = 1, loop = false) {
        if(this._isMute) return;
        this.soundSource.clip = this._audioClipSet[audioClipName];
        this.soundSource.volume = volume;
        this.soundSource.loop = loop;
        if(loop) return;
        this.soundSource.play();
    }

}


