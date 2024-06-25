import { assetManager, AudioClip, director, Prefab } from 'cc';
import PoolManager from './PoolManager';
import { IManager } from './IManager';
import { SCENE_TO_RESOURCES_MAPPING } from './Enum';

export default class ResourceManager implements IManager {
    private static readonly PREFAB_PATH: string = "Prefab";

    initialize() {
        this.loadResource();
    }
    progress(): number {
        let arr: number[] = [
            this._prefabDataProgress
        ];
        return arr.reduce((t, curr) => t + curr, 0) / arr.length;
    }

    initializationCompleted(): boolean {
        let arr: boolean[] = [
            this._prefabDataDone
        ];
        return arr.every(x => x);
    }


    

    private _prefabDataProgress: number;
    private _prefabDataDone: boolean;
    
    public loadResource() {
        //load prefab
        this._prefabDataProgress = 0;
        this._prefabDataDone = false;
        assetManager.loadBundle(SCENE_TO_RESOURCES_MAPPING[director.getScene().name], (error, bundle) => {
            bundle.loadDir(ResourceManager.PREFAB_PATH, Prefab,
                (finish, total, item) => {
                    this._prefabDataProgress = finish / total;
                }
                ,
                (err, assets) => {
                    if (err) console.error(err);
                    let asset: any
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        PoolManager.instance.setPrefab(asset.data.name, asset)
                    }
                    this._prefabDataProgress = 1;
                    this._prefabDataDone = true;
                }
            )
        })

        // resources.loadDir(ResourceManager.PREFAB_PATH, Prefab,
        //     (finish, total, item) => {
        //         this._prefabDataProgress = finish / total;
        //     }
        //     ,
        //     (err, assets) => {
        //         if (err) console.error(err);
        //         let asset: any
        //         for (let i = 0; i < assets.length; i++) {
        //             asset = assets[i];
        //             PoolManager.instance.setPrefab(asset.data.name, asset)
        //         }
        //         this._prefabDataProgress = 1;
        //         this._prefabDataDone = true;
        //     })

    }

}
