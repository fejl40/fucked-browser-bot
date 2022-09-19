import axios from "axios";

export const imageApiUrl = "https://freeimage.host/api/1/upload";
export const placeholder = "https://prod.cdn.bbaws.net/TDC_Blockbuster_-_Production/18/980/PP-7302_bd-w-superhigh_orig.jpg";

export const uploadImage = async (location: string): Promise<string|null> => {
    const imageLatest = `${process.env.HOSTNAME}${location.substring(location.lastIndexOf("/"))}`;
    const fullApiUrl = `${imageApiUrl}?key=${process.env.FREE_IMAGE_HOST_TOKEN}&source=${imageLatest}`;
    const value = await axios.get(fullApiUrl);
    if (value.status === 200) {
        const url = value.data?.image?.url;
        if (url) return url;
    }
    console.error("image upload failed");
    return null;
}