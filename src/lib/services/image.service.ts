class ImageServiceClass {
    /**
     * Get image URL by image ID
     * TODO: Server API needs GET /images/:id endpoint
     */
    async getUrlByImageId(imageId: string): Promise<string | null> {
        // TODO: Implement getUrlByImageId endpoint in server-api
        // GET /images/:id
        console.warn('getUrlByImageId not yet implemented via REST API');
        throw new Error(
            'Get image URL endpoint not yet implemented in REST API'
        );
    }

    /**
     * Remove an image
     * TODO: Server API needs DELETE /images endpoint
     */
    async removeImage(imageUrl: string): Promise<boolean> {
        // TODO: Implement removeImage endpoint in server-api
        // DELETE /images?url=:imageUrl
        console.warn('removeImage not yet implemented via REST API');
        throw new Error(
            'Remove image endpoint not yet implemented in REST API'
        );
    }
}

const ImageService = new ImageServiceClass();
export default ImageService;
