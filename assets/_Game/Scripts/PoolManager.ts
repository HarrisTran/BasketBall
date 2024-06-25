import { instantiate, Node, NodePool, Prefab, Vec3 } from "cc"

export default class PoolManager {

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<PoolManager>()
    }

    private _dictPool: any = {}
    private _dictPrefab: any = {}

    public copyNode(copynode: Node, parent: Node | null): Node {
        let name = copynode.name;
        this._dictPrefab[name] = copynode;
        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(copynode);
            }
        } else {

            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(copynode);
        }
        if (parent) {
            node.parent = parent;
            node.active = true;
        }
        return node;
    }

    public getNode(prefab: Prefab | string, parent?: Node, worldpos?: Vec3): Node {
        let tempPre: any;
        let name: any;
        if (typeof prefab === 'string') {
            tempPre = this._dictPrefab[prefab];
            name = prefab;
            if (!tempPre) {
                console.log("Pool invalid prefab name = ", name);
                return null;
            }
        }
        else {
            tempPre = prefab;
            name = prefab.data.name;
        }

        let node: Node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(tempPre);
            }
        } else {
            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(tempPre);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
            if (worldpos) node.worldPosition = worldpos;
        }
        return node;
    }
    
    public putNode(node: Node | null) {
        if (!node) {
            return;
        }
        let name = node.name;
        let pool = null;
        if (this._dictPool.hasOwnProperty(name)) {
            pool = this._dictPool[name];
        } else {
            pool = new NodePool();
            this._dictPool[name] = pool;
        }
        pool.put(node);
    }

    public clearPool(name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }

    public getPrefab(name: string): Prefab {
        return this._dictPrefab[name];
    }

    public setPrefab(name: string, prefab: Prefab) {
        this._dictPrefab[name] = prefab;
    }

}
