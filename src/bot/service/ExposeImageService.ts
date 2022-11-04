import axios from "axios";
import { logger } from "../../mainlogger";

export class ExposeImageService {
    private readonly _imageApiUrl: string = "https://freeimage.host/api/1/upload";
    private readonly _placeholderImageForDevelopment: string =
        "https://prod.cdn.bbaws.net/TDC_Blockbuster_-_Production/18/980/PP-7302_bd-w-superhigh_orig.jpg";

    public async uploadImage(imageFilename: string): Promise<string | null> {
        console.log("ImageFileName", imageFilename);
        const localImageUrl = this.localUrl(imageFilename);
        const fullApiUrl = `${this._imageApiUrl}?key=${process.env.FREE_IMAGE_HOST_TOKEN}&source=${localImageUrl}`;
        logger.info(`free-image api request: ${fullApiUrl}`);
        const value = await axios.get(fullApiUrl);

        if (value.status === 200) {
            const url = value.data?.image?.url;
            if (typeof url === "string") return url;
        }

        logger.error("image upload failed");
        return null;
    }

    private localUrl(imageFilename: string): string {
        let pathToImage = `${process.env.HOSTNAME}/${imageFilename}`;
        if (process.env.NODE_ENV !== "production") pathToImage = this._placeholderImageForDevelopment;
        return pathToImage;
    }
}
