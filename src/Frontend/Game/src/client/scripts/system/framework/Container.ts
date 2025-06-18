export default class Container {
    constructor() {

    }

    addChild(child: Container) {
        this._children.push(child);
    }

    removeChildren() {
        this._children.forEach(child => {
            child.removeChildren();
        })
        this._children = [];
    }

    private _children: Container[] = [];
}