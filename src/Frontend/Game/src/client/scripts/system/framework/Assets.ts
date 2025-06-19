export type AssetsManifest = {
    bundles: {
        name: string,
        assets: {
            alias: string,
            src: string
        }[]
    }[]
}

export default class Assets {
    private constructor() {
    }

    static init(assetsManifest: AssetsManifest) {
        this._aliasImageMap = new Map<string, HTMLImageElement>();
        this._manifest = assetsManifest;
    }

    static async loadBundle(bundleName: string) {
        const bundleToLoad = this._manifest.bundles.find(bundle => bundle.name === bundleName);
        if (bundleToLoad) {
            const promises = bundleToLoad.assets.map(async asset => {
                const image = await this.loadImage(asset.src); //TODO: Not all are images!! Check how to read fonts
                this._aliasImageMap.set(asset.alias, image);
            })
            await Promise.all(promises);
        }
    }

    static loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src;
        });
    }

    static getImage(imageAlias: string) {
        return (this._aliasImageMap.get(imageAlias));
    }

    private static _manifest: AssetsManifest;
    private static _aliasImageMap: Map<string, HTMLImageElement>;
}